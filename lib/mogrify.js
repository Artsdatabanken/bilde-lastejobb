// https://imagemagick.org/script/command-line-options.php#auto-level
class Mogrify {
  args = [];

  constructor() {
    this.autoOrient();
  }

  transparent(color = "white") {
    this.push("-transparent", color);
  }

  density(dpi = 600) {
    this.push("-density", dpi);
  }

  trim() {
    this.push("-trim");
  }

  background(color) {
    this.push("-background", color);
  }

  autolevel() {
    this.push("-channel ARGB,sync", "-auto-level");
  }

  border(pixels) {
    this.push("-border ", pixels);
    this.push("-bordercolor", "transparent");
  }

  autoOrient() {
    this.push("-auto-orient");
  }

  repage() {
    // Completely remove/reset the virtual canvas meta-data from the images.
    this.push("+repage");
  }

  push(...v) {
    v.forEach(x => this.args.push(x));
  }

  gravity(direction = "center") {
    this.push("-gravity", direction);
  }

  extent(dims) {
    this.push("-extent", dims);
  }

  format(format = "png") {
    this.push("-format", format);
  }

  destPath(targetPath) {
    this.push("-path", targetPath);
  }

  resize(dims) {
    this.push("-resize", dims);
  }

  convert(kildesti) {
    const cmdLine = this.args.join(" ") + " " + kildesti;
    console.log("mogrify " + cmdLine);
  }
}

module.exports = Mogrify;
