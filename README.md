# STOH
Simple Text to HTML.
STOH is a simple language that complies to a HTML template.
## Get Started
! - I am not currently working on this yet
###### for temporary use.
1. open dist/stoh.js.
2. edit file output and file input's directory.
3. create input.stoh, and write the stoh.
4. run node stoh.js to compile .stoh to .html.
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