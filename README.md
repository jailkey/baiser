# baiser.js
Simple two way template engine

baiser.js provides an easy way to generate content by a template/data set and extracting the data from the generated content based on the template.
![baiser.js flow](https://github.com/jailkey/baiser/blob/master/doc/image/baiser-flow.png)
For extracting the data from the content baiser.js use unvisible controll chars to mark the data in the generated content.
baiser.js is native javascript, with no dependencys

## install baiser.js
donwload baiser.js and include it to your document:

```html
<script type="text/javascript" src="baiser.js"></script>
```

## use
Baiser has only two methodes (generate/extract), one for generating content and one for extracting data.
Here a littel example how to generate content.

create an instace of braiser
```javascript
var baiser = new Baiser();
```

Create a template, you can use a string or a function with comments for a multiline template.
In this example we generate some markdown content
```javascript
var template = function(){/*
###{{topic}}
{{#list}}
  {{^listitem}}####Show this if listitem is set: {{listitem}}{{/^listitem}}
  {{#sublist}}* {{.}}
  {{/sublist}}
{{/list}}
*/};
```
We need data, create it:
```javascript
var data = {
	topic : "Thats the Topic",
	list : [
		{
			listitem : "listitem value",
			sublist : [
				"One", "Two", "Three"
			]
		},
		{
			listitem : "another listitem value",
			sublist : [
				"Four", "Five", "Six"
			]
		}
	]
};
```
And generate the content:
```javascript
var content = baiser.generate(template, data);
```

Now the value of content looks like this:
```markdown
###￻Thats the Topicﾠ
￹‎
  ####Show this if listitem is set: ￻listitem valueﾠ
  ￹‎* ​One⁣
  ‏‎* ​Two⁣
  ‏‎* ​Three⁣
  ‏￺
‏‎
  ####Show this if listitem is set: ￻another listitem valueﾠ
  ￹‎* ​Four⁣
  ‏‎* ​Five⁣
  ‏‎* ​Six⁣
```

If we want to extract the data from the content, we only have to use the extract method:
```javascript
var extractedData = baiser.extract(template, content);

```

###Templating
baiser provides a minimal template language with the following commands.
Everything command is surrounded by dubble currly brackets is a command.

####Variable
Every command that did not start with . / ^ # is a varaible
```
	{{myentry}}
```

####List
A List starts with a # and ends with /
```
	{{#list}}
		{{listentry}}
	{{/list}}
```

####Pointer
A pointer refers to an array value the command is .
```
	{{#list}}
		{{.}}
	{{/list}}
```

####Exists
To check if a value exists use ^ at the beginning and /^
```
	{{^myvalue}}
		This sentences will only displayed if myvalue exists!
	{{/^myvalue}}
```











