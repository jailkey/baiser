//Template
var baiser, content;

var template = function(){/*
	{{singlevar}}
	{{#list}}
		{{?listelement}}
			List element exists.
		{{/?listelement}}
		{{!listelement}}
			List element does not exists.
		{{/!listelement}}
		{{#sublist}}
			{{.}}
		{{/sublist}}
	{{/list}}
*/};


var data = {
	singlevar : 'singlevarvalue',
	list : [
		{
			listelement : "listelementvalue1",
			sublist : [
				"one", "two", "three"
			]
		},
		{
			sublist : [
				"four", "five", "six"
			]
		},
		{
			listelement : "listelementvalue3"
		}
	]

}


describe("Test baiser.js", function () {
	describe("generate content from template/data", function(){

		
		
		it("create instance", function(){
			baiser = new Baiser();
		});

		it("create content", function(){
			content = baiser.generate(template, data);
		});

		it("test if 'exists' work", function(){
			var parts = content.split("List element exists.");
			expect(parts.length).toEqual(3);
		});

		it("test if 'not exists' work", function(){
			var parts = content.split("List element does not exists.");
			expect(parts.length).toEqual(2);
		});

		it("test if 'pointers' are working", function(){
			expect(content).toContain('one');
			expect(content).toContain('two');
			expect(content).toContain('three');
			expect(content).toContain('four');
			expect(content).toContain('five');
			expect(content).toContain('six');
		});

	});

	describe("extract data from template/content", function(){
		
	})
});