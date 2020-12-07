const { enhanceConsole } = require('../index.js');
const stripIndent = require('strip-indent');
describe('transform console', function () {
  it('should not transform custom log function', () => {
    const file = stripIndent(`
      log('something')
    `).trim();
    const transformedFile = enhanceConsole(file);
    expect(transformedFile).toBe(`log('something');`);
  });

  it('should insert the correct line, column number to the built-in console', () => {
    const file = stripIndent(`
      console.log("something")
      console.info("something")
      console.error("something")
      console.warn("something")
    `).trim();
    const transformedFile = enhanceConsole(file);
    expect(transformedFile).toBe(
      stripIndent(`
        console.log("1:0", "something");
        console.info("2:0", "something");
        console.error("3:0", "something");
        console.warn("4:0", "something");
    `).trim()
    );
  });

  // it('should pass when path contain identifier', () => {
  //   const file = `sget(foo.bar, a,'b')`;
  //   const transformedFile = enhanceConsole(file);
  //   expect(transformedFile).toBe(
  //   );
  // });
});
