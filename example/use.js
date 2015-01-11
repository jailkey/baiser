//Init
var baiser = new Baiser();

//create a template
var template = function(){/*
###{{topic}}
{{#list}}
  {{^listitem}}####Show this if listitem is set: {{listitem}}{{/^listitem}}
  {{#sublist}}* {{.}}
  {{/sublist}}
{{/list}}
*/}

//create data
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
}



var content = baiser.generate(template, data)
document.querySelector("[name=output]").value = content;


var data = baiser.extract(template, content);
console.log("data", JSON.stringify(data));

