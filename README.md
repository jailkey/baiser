# Baiser.js
Simple two way template engine.

Baiser.js provides an easy way to generate content by a template/data set and extracts the data from the generated content based on the template.
![baiser.js flow](https://github.com/jailkey/baiser/blob/master/doc/image/baiser-flow.png)
For extracting the data baiser.js uses invisible control chars to mark the data in the generated content.
Baiser.js is native javascript, with no dependencies.

## install baiser.js
donwload baiser.js or install with bower:
```
	bower install baiser
``

and include it to your document:
```html
<script type="text/javascript" src="baiser.js"></script>
```

## use
Baiser has only two methods (generate/extract), one for generating content and one for extracting data.
Here a little example how to generate content.

Create an instance of braiser:
```javascript
var baiser = new Baiser();
```

Create a template. You can use a string or a function with comments for a multiline template.
In this example we generate some markdown content:
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
We need data, so we create some:
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
Now we generate the content:
```javascript
var content = baiser.generate(template, data);
```

At this point the value of content looks like this:
```markdown
###Thats the Topicﾠ

  ####Show this if listitem is set: listitem valueﾠ
  * ​One
  ‏‎* ​Two
  ‏‎* ​Three
  ‏
‏‎
  ####Show this if listitem is set: another listitem valueﾠ
  * ​Four
  ‏‎* ​Five
  ‏‎* ​Six
```

If we want to extract the data from the content, we only have to use the extract method:
```javascript
var extractedData = baiser.extract(template, content);

```

###Templating
Baiser provides a minimal template language.
Every command is surrounded by dubble currly brackets.

####Variable
Every command that does not start with . / ? ! # is a variable
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
A pointer refers to an array value. The command is .
```
	{{#list}}
		{{.}}
	{{/list}}
```

####Exists
To check if a value exists use ? at the beginning and /? at the end
```
	{{?myentry}}
		This sentence will be only displayed if myentry exists!
	{{/?myentry}}

```

####Not Exists
To check if a value does not exist use ! at the beginning and /! at the end
```
	{{!myentry}}
		This sentence will be only displayed if myentry does not exist!
	{{/!myentry}}

```


