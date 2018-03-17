# stoh
------
Simple Text to HTML.
STOH is a simple language that complies to a HTML template.
## Get Start
------
! - I am not currently working on this yet
### How does It look like?
------
##### STOH
```
title="STOH| Simple Text to HTML";
html{
    head{
        title{&title}
    }
    body{
        p{;Hello World}
    }
}
```
##### Complied HTML
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