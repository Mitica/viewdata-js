# viewdata

**viewdata** module for nodejs

### Usage

```
var path = require('path);
var repository = require('viewdata')(path.join(__dirname, './repository'));

var viewdata = repository({
  tag: {
    params: {
      name: 'tag-name'
    }
  },
  news: {
    params: {
      tag: 'tag-name',
      limit: 10
    }
  }
});

// async gets all viewdata
viewdata.get(function(error, data) {
  
});

```

## API


### (sources)

Default method. Repository creator. Returns a `Repository`.

`sources` can be a string, an array of strings, a object or an array of objects - repository sources.

### repository(props)

...
