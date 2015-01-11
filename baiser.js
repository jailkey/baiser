/**
 * @version 0.1
 * @author Jan Kaufmann
 */

(function(window){

	//Errors
	var ERROR_TEMPLATE_TYPE = "Template must be a string or a function!",
		ERROR_MISSING_TEMPLATE_TREE = "Template tree not found!";

	//NodeTypes
	var LIST = "\uFFF9",
		LIST_END = "\uFFFA",
		LIST_ENTRY = "\u200E",
		LIST_ENTRY_END = "\u200F",
		ENTRY =	"\uFFFB",
		ENTRY_END =	"\uFFA0",
		ROOT = "--root--",
		TEXT = "--text--",
		POINTER = "\u200B",
		POINTER_END = "\u2063",
		BLOCK = "--block--",
		BLOCK_END = "--block-end--";


	var getTypeName = function(type){
		switch(type){
			case LIST:
				return "list";
			case LIST_END:
				return "list-end";
			case LIST_ENTRY:
				return "list-entry";
			case LIST_ENTRY_END:
				return "list-entry-end";
			case ENTRY:
				return  "entry";
			case ENTRY_END:
				return "entry-end";
			case ROOT:
				return "root";
			case TEXT:
				return "text";
			case POINTER:
				return "pointer";
			case POINTER_END:
				return "pointer-end";
			case BLOCK:
				return "block";
			case BLOCK_END:
				return "block-end";
		}
	}

	
	//States
	var OPEN = "--open--",
		CLOSED = "--closed--";

/**
 * TemplateNode
 * @param {const} type the type of the node
 */
	var TemplateNode = function(type){
		this.type = type;
		this.children = [];
		this.content = '';
		this.parent = false;
		this.name = '';
	}

	TemplateNode.prototype = {
		addChild : function(child){
			child.parent = this;
			this.children.push(child)
		},
		addContent : function(content){
			if(this.type === TEXT){
				this.content += content
			}else{
				if(!/(#|\/|\^)/.test(content)){
					this.name += content;
				}
			}
		}
	}

/**
 * @constructor Template
 * @param {string|function} template the template
 */
	var Template = function(template){

		//Init template get string from function for use multiline templates
		if(typeof template === "function"){
			this.template 
				= template
					.toString()
					.replace(/(^function\s*\(\)\s*\{\s*\/\*)([\s\S]*)(\*\/\s*\})/g, function(){
						return arguments[2];
					});
		}else if(string){
			this.template = template;
		}else{
			throw new Error(ERROR_TEMPLATE_TYPE);
		}

		this.templateTree = false;
		this.parseTemplate();
	}

	Template.prototype = {
/**
 * getNodeType
 * @description returns the node type by Nodename
 * @param  {string} nodeName name of the node
 * @return {string} 
 */
		getNodeType : function(nodeName){
			switch(nodeName){
				case "/^":
					return BLOCK_END;
			}
			switch(nodeName[0]){
				case "#":
					return LIST;
				case "/":
					return LIST_END;
				case "^":
					return BLOCK;
				case ".":
					return POINTER;
				default:
					return ENTRY;
			}
		},
/**
 * generateContent
 * @description generates content by the given data
 * @param  {object} data an object with template data
 * @return {string} 
 */
		generateContent : function(data){
			if(!this.templateTree){
				throw new Error(ERROR_MISSING_TEMPLATE_TREE);
			}
			//creates a branch of the templatetree recusive
			var createBranch = function(branch, data, counter){
				var i = 0,
					counter = counter || 0,
					len = branch.length,
					output = "";

				for(; i < len; i++){
					switch(branch[i].type){
						case TEXT:
							output += branch[i].content;
							break;
						case LIST:
							output += LIST;
							if(data[branch[i].name]){
								var listLen = data[branch[i].name].length, y = 0;
								for(; y < listLen; y++){
									output += LIST_ENTRY;
									output += createBranch(branch[i].children, data[branch[i].name][y], y);
									output += LIST_ENTRY_END;
								}
							}
							break;
						case LIST_END:
							output += LIST_END;
							break;
						case BLOCK:
							
							if(data[branch[i].name]){
								output += createBranch(branch[i].children, data);
							}
							break;
						case BLOCK_END:
							
							break;
						case POINTER:
							output += POINTER;
							output += data;
							output += POINTER_END;
							break;
						case ENTRY:
							output += ENTRY;
							if(data[branch[i].name]){
								output += data[branch[i].name];
							}
							output += ENTRY_END;
							break;
					}
				}

				return output;
			}

			return createBranch(this.templateTree.children, data);
		},
/**
 * parseTemplate
 * @description parse the given template an creates a tree
 * @return {object} returns the tmeplate tree
 */
		parseTemplate : function(){
			var template = this.template,
				i = 0,
				state = CLOSED,
				len = template.length,
				selected = false,
				previous = false,
				next = false,
				root = new TemplateNode(ROOT),
				tree = root,
				type = false,
				node = tree;

			for(; i < len; i++){
				selected = template[i];
				previous = (i > 0) ?  template[i - 1] : false;
				next = function (count){
					count = count || 1;
					return (i +  count < len) ?  template[i + count] : false;
				}

				switch(selected){
					case "{":
						if(previous === "{"){
							state = OPEN;
							node = new TemplateNode(this.getNodeType(next(1)+next(2)));

							if(node.type == LIST_END || node.type === BLOCK_END){
								tree.parent.addChild(node);
							}else{
								tree.addChild(node);
							}
							if(node.type === LIST || node.type === BLOCK){
								tree = node;
							}
						}
						break;
					case "}":
						if(next() === "}"){

							if(node.type === LIST_END || node.type === BLOCK_END){
								tree = node.parent;
								node = node.parent;
							}
							state = CLOSED;
						}
						break;
					default :
						if(state === CLOSED && node.type !== TEXT){
							node = new TemplateNode(TEXT);
							tree.addChild(node);
						}
						node.addContent(selected);
						break;
				}
			}
			this.templateTree = root;
			return root;
		}
		
	}
/**
 * ContentNode
 * @param {const} type the node type
 */
	var ContentNode = function(type){
		this.type = type;
		this.typeName = getTypeName(type);
		this.content = "";
		this.children = [];
		this.parent = false;
	}

	ContentNode.prototype = {
		addChild : function(child){
			child.parent = this;
			this.children.push(child);
		},
		addContent : function(content){
			this.content += content;
		}
	}

/**
 * @constructor Content
 * @description extracts Data from generated content by given template
 * @param {srting} template string with temaplate
 * @param {string} content  string with content
 */
	var Content = function(template, content){
		var template = new Template(template);
		this.templateTree = template.templateTree;
		this.content = content;
		this.contentTree = this.parseContent(template, content);
		this.data = this.getDataObject(this.contentTree, this.templateTree);
	}

	Content.prototype = {
/**
 * @getNextType
 * @param  {object} data  object with structure data
 * @param  {number} start position of the searched type
 * @param  {const} type  Datatype
 * @return {mixed}  returns the sturcture object or false
 */
		getNextType : function(data, start, type){
			var len = data.length,
				i = i || 0,
				count = 0;

			for(; i < len; i++){
				if(data[i].type === BLOCK){
					
					var blockLen = data[i].children.length;
						y = 0;

					for(; y < blockLen; y++){
						if(data[i].children[y].type === type){
							if(count === start){
								return data[i].children[y];
							}
							count++;
						}
					}
				}
				if(data[i].type === type){

					if(count === start){
						return data[i];
					}
					count++;
				}
			}
			return false;
		},
/**
 * getDataObject
 * @description merge contentTree and  templateTree and returns a data object
 * @param  {object} contentTree  the contenttree
 * @param  {object} templateTree the templatetree
 * @return {object} returns a data object
 */
		getDataObject : function(contentTree, templateTree){
			
			var data = {},
				i = 0,
				len = contentTree.children.length,
				counts  = {
					entry : 0,
					list : 0,
				};

			for(; i < len; i++){
				var selectedContent = contentTree.children[i]
				
				switch(selectedContent.type){
					case ENTRY:
						var entry = this.getNextType(templateTree.children, counts.entry, ENTRY);
						counts.entry++;
						
						data[entry.name] = selectedContent.content;
						break;
					case LIST:
						
						var entry = this.getNextType(templateTree.children, counts.list, LIST);
						
						var listData = this.getDataObject(selectedContent, entry);
						
						counts.list++;
						
						if(data[entry.name] && data[entry.name].constructor === Array){
							data[entry.name] = data[entry.name].concat(listData)
						}else{
							data[entry.name] = listData
						}
						break;
					case LIST_ENTRY:
						if(data.constructor !== Array){
							data = [];
						}
						var entryData = this.getDataObject(selectedContent, templateTree);
						if(entryData.constructor == Array){
							data = data.concat(entryData);
						}else{
							data.push(entryData);
						}
						break;
					case POINTER:
						if(data.constructor !== Array){
							data = [];
						}
						data.push(selectedContent.content);
						break;

				}
			}
			return data;
		},
/**
 * parseContent
 * @description parse genereted content by the specified template
 * @param  {string} template the template
 * @param  {string} content  the generated content
 * @return {object} returns a template 
 */
		parseContent : function(template, content){
			
			var i = 0,
				len = this.content.length,
				selected = "",
				root = new ContentNode(ROOT);
				node = root,
				tree = root,
				count = 0,
				collected = "";


			for(; i < len; i++){
				selected = this.content[i];

				switch(selected){
					case LIST:
						node = new ContentNode(LIST);
						tree.addChild(node);
						tree = node;
						break;
					case LIST_END:
						tree = tree.parent;
						node = tree;
						break;
					case LIST_ENTRY:
						node = new ContentNode(LIST_ENTRY);
						tree.addChild(node);
						tree = node;
						break;
					case LIST_ENTRY_END:
						tree = tree.parent;
						node = tree;
						break;
					case ENTRY:
						node = new ContentNode(ENTRY);
						tree.addChild(node);
						break;
					case ENTRY_END:
						node = new ContentNode(ENTRY_END);
						break;
					case POINTER:
						node = new ContentNode(POINTER);
						tree.addChild(node);
						break;
					case POINTER_END:
						node = new ContentNode(POINTER_END);
						break;
					default :
						if(node.type === ENTRY || node.type === POINTER){
							node.addContent(selected);
						}
						break;
				}
				
			}
			return root;
		}

	}


/**
 * @constructor TwoWayTemplate
 * @description the two way template interface
 */
	var Baiser = function(){
		this.template = false;
		this.content = false;
	}


	Baiser.prototype = {
/**
 * @method  extract
 * @description extracts the data from generated content based on the given template
 * @param  {string} template the specified template
 * @param  {string} content   the generate content
 * @return {object} returns an object of data if successfull else it returns false
 */
		extract : function(template, content){
			this.content = new Content(template, content);
			return this.content.data;
		},
/**
 * @method generate
 * @description generates content from template and data
 * @param  {string} template the given template
 * @param  {object} data an (json) object with the template data
 * @return {string} returns the generated data
 */
		generate : function(template, data){
			this.template = new Template(template)
			return this.template.generateContent(data);
		}
	}


	window.Baiser = Baiser;

}(window));