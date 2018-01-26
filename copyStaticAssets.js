var shell = require('shelljs');

shell.rm('-fR', 'dist/static');
shell.cp('-R', 'src/static', 'dist/static');
