import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEcbJson, normalizePoints } from '../data/normalize';

type EcbObservation = number | (number | null)[] | null;

interface FixtureOptions {
  periods: string[];
  observations: Record<string, EcbObservation>;
  includeStructure?: boolean;
}

function sdmxFixture({ periods, observations, includeStructure = true }: FixtureOptions): unknown {
  const fixture: Record<string, unknown> = {
    header: { id: 'fixture', test: false, prepared: '2026-10-01T15:57:18.650+02:00', sender: { id: 'ECB' } },
    dataSets: [
      {
        action: 'Replace',
        validFrom: '2026-10-01T15:57:18.650+02:00',
        series: {
          '0:0:0:0:0': {
            attributes: [0, null, 0, null, null, null, null, null, null, 0, null, null, 0, null, null, null, 0, 0, 0, 0],
            observations,
          },
        },
      },
    ],
  };
  if (includeStructure) {
    fixture.structure = {
      dimensions: {
        series: [
          { id: 'FREQ', name: 'Frequency' },
          { id: 'CURRENCY', name: 'Currency' },
          { id: 'CURRENCY_DENOM', name: 'Currency denominator' },
          { id: 'EXR_TYPE', name: 'EXR type' },
          { id: 'EXR_SUFFIX', name: 'EXR suffix' },
        ],
        observation: [
          {
            id: 'TIME_PERIOD',
            name: 'Time period or range',
            values: periods.map(period => ({ id: period, name: period, start: `${period}T00:00:00.000+01:00`, end: `${period}T23:59:59.999+01:00` })),
          },
        ],
      },
    };
  }
  return fixture;
}

test('ECB SDMX-JSON 2.0 observations resolve to dated numeric points', () => {
  const points = normalizeEcbJson(
    sdmxFixture({ periods: ['2026-09-30', '2026-10-01', '2026-10-02'], observations: { '0': [1.1298, 0, null, null, null], '1': [1.131, 0, null, null, null], '2': [1.1305, 0, null, null, null] } })
  );
  assert.deepEqual(points, [
    { date: '2026-09-30', value: 1.1298 },
    { date: '2026-10-01', value: 1.131 },
    { date: '2026-10-02', value: 1.1305 },
  ]);
});

test('ECB observations missing a numeric value are dropped, not coerced', () => {
  const points = normalizeEcbJson(
    sdmxFixture({ periods: ['2026-09-30', '2026-10-01', '2026-10-02'], observations: { '0': [1.1298, 0], '1': [null, 0], '2': [1.1305, 0] } })
  );
  assert.deepEqual(points.map(point => point.date), ['2026-09-30', '2026-10-02']);
  assert.ok(points.every(point => Number.isFinite(point.value)));
});

test('ECB points are deduplicated by date and sorted ascending', () => {
  const points = normalizeEcbJson(
    sdmxFixture({ periods: ['2026-10-03', '2026-10-01', '2026-10-02', '2026-10-01'], observations: { '0': [1.3, 0], '1': [1.1, 0], '2': [1.2, 0], '3': [1.15, 0] } })
  );
  assert.deepEqual(points.map(point => point.date), ['2026-10-01', '2026-10-02', '2026-10-03']);
  assert.deepEqual(points.map(point => point.value), [1.15, 1.2, 1.3]);
});

test('bare numeric ECB observations are still accepted', () => {
  const points = normalizeEcbJson(sdmxFixture({ periods: ['2026-10-01'], observations: { '0': 1.1298 } }));
  assert.deepEqual(points, [{ date: '2026-10-01', value: 1.1298 }]);
});

test('ECB payload without a TIME_PERIOD dimension yields no points', () => {
  const points = normalizeEcbJson(sdmxFixture({ periods: [], observations: { '0': [1.1298, 0] }, includeStructure: false }));
  assert.deepEqual(points, []);
});

test('rejects payloads that are not ECB SDMX-JSON', () => {
  assert.deepEqual(normalizeEcbJson(null), []);
  assert.deepEqual(normalizeEcbJson(undefined), []);
  assert.deepEqual(normalizeEcbJson({}), []);
  assert.deepEqual(normalizeEcbJson({ data: { dataSets: [] } }), []);
  assert.deepEqual(normalizeEcbJson({ dataSets: [] }), []);
  assert.deepEqual(normalizeEcbJson({ dataSets: [{ series: {} }] }), []);
});

test('the real response is not nested under a data wrapper', () => {
  assert.ok((sdmxFixture({ periods: ['2026-10-01'], observations: { '0': [1.1298, 0] } }) as Record<string, unknown>).dataSets);
  assert.equal((sdmxFixture({ periods: ['2026-10-01'], observations: { '0': [1.1298, 0] } }) as Record<string, unknown>).data, undefined);
});

test('normalizePoints remains the shared validation, dedupe and sort stage', () => {
  const input = [
    { date: '2026-10-03', value: 2 },
    { date: '2026-10-01', value: 1 },
    { date: '2026-10-02', value: 3 },
    { date: '2026-10-02', value: 4 },
    { date: 'not-a-date', value: 5 },
    { date: '2026-10-04', value: Number.NaN },
    { date: '2026-10-05', value: Number.POSITIVE_INFINITY },
  ];
  assert.deepEqual(normalizePoints(input), [
    { date: '2026-10-01', value: 1 },
    { date: '2026-10-02', value: 4 },
    { date: '2026-10-03', value: 2 },
  ]);
  assert.deepEqual(normalizePoints('not-an-array'), []);
});
