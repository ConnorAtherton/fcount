fcount
======

Recursively count the number files in the current directory given file extensions to match on.

Usage
=============

All extensions you want counted should be entered in a space seperated list.

```
$ fcount [extensions...]
```

Example
=======

```
$ fcount js json java
```

The above will return something similiar to this in the shell

```
┌───────────┬───────┐
│ File type │ Count │
├───────────┼───────┤
│ js        │ 349   │
├───────────┼───────┤
│ json      │ 57    │
├───────────┼───────┤
│ java      │ 1     │
└───────────┴───────┘
```

Note: Any files in hidden directories such as ```.git``` will **not** be counted.

TODO
====

 - Add in the ability to exclude certain folders from the directory traversal. For example,
all files inside of ```node_modules``` should not be counted. I'm thinking to use the ```-e```
flag followed by a space seperated list of diretcory name.

```
$ fcount js json -e node_modules
```

- Document methods in count.js.

- TESTS. It's 1.20am right now, need to come back and do later!


