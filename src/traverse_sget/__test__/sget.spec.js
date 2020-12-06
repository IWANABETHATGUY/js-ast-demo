const { transformSget } = require('../index.js');

describe('transform safe get', function () {
  it('should pass when path is string literal', () => {
    const file = `sget(foo.bar, 'a', 'b', 'c')`;
    const transformedFile = transformSget(file);
    expect(transformedFile).toBe(
      `foo === undefined ? void 0 : foo.bar === undefined ? void 0 : foo.bar['a'] === undefined ? void 0 : foo.bar['a']['b'] === undefined ? void 0 : foo.bar['a']['b']['c'] === undefined ? void 0 : foo.bar['a']['b']['c'];`
    );
  });

  it('should pass when path contain identifier', () => {
    const file = `sget(foo.bar, a,'b')`;
    const transformedFile = transformSget(file);
    expect(transformedFile).toBe(
      `foo === undefined ? void 0 : foo.bar === undefined ? void 0 : foo.bar[a] === undefined ? void 0 : foo.bar[a]['b'] === undefined ? void 0 : foo.bar[a]['b'];`
    );
  });
});
