const { transformJquery } = require('../index.js');
const stripIndent = require('strip-indent');
describe('transform safe get', function () {
  it('should pass jquery', () => {
    const file = stripIndent(`
      $(element).hide();
      test.$(element).hide();
      something.hide()`).trim();
    const transformedFile = transformJquery(file);
    expect(transformedFile).toBe(
      stripIndent(
        `
       element.style.display = 'none';
      test.$(element).hide();
      something.hide();`
      ).trim()
    );
  });

  // it('should pass when path contain identifier', () => {
  //   const file = `sget(foo.bar, a,'b')`;
  //   const transformedFile = transformSget(file);
  //   expect(transformedFile).toBe(
  //     `foo === undefined ? void 0 : foo.bar === undefined ? void 0 : foo.bar[a] === undefined ? void 0 : foo.bar[a]['b'] === undefined ? void 0 : foo.bar[a]['b']`
  //   );
  // });
});
