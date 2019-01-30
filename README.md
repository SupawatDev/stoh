# STOH
Simple Text to HTML.
STOH is a simple language that complies to a HTML template.

# THIS PROJECT IS NO LONGER MAINTAINED.
Due to the mess of unorganized code, long-time inactivitiy of project, and no reasons of being useful, the author can no longer implement the project and has no choice but to let this project be achieved.

## Get Started
Now, You are in the very first version of STOH. the CLI hasn't implemented yet.
You can start compile .st code by using command,
1. Get in your input directory and create your .st file (Eg, index.st)
2. run stoh,
```
    node dist/stoh.js <file-input-name>.st <file-output-name>.html
```
### How does It look like?
##### STOH,
```
var title="STOH| Simple Text to HTML";
html{
    head{
        title{&title}
    }
    body{
        p{;Hello World}
    }
}
```
##### Complied HTML,
```html
<html>
    <head>
        <title>
        STOH | Simple Text to HTML
        </title>
    </head>
    <body>
        <p>
        Hello World
        </p>
    </body>
</html>
```
