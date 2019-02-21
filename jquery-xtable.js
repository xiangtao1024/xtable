/*!
 * XTable v0.0.1
 * Copyright 2018-06-19 XTable
 * 作者: 向涛
 * XTable  一个表格显示框架
 */
;(function($, window, document){
	$.XTable = {
		/**
		 * 设置参数 顺便计算每个元素的子元素个数，生成Html时rowspan要用到
		 * @method setOption
		 * @param {option} 参数.
		 * @return
		 **/
		setOption: function(option){
			this.option = this.setSize(option);
		},
		/**
		 * 获取参数
		 * @method getOption
		 * @return {option}
		 **/
		getOption: function(){
			return this.option;
		},
		/**
		 * 将其生成的Html在table中显示
		 * @method show
		 * @param {id} table的id.
		 * @return
		 **/
		show: function(id){
			this.renderThead(id);
			this.renderTbody(id);
		},
		renderThead: function(id){
			if(this.option.head){
				var thead = document.createElement("thead");
				var tr = "<tr>"
				for(var i = 0; i < this.option.head.length; i ++){
					head = this.option.head[i];
					var style = "";
					var stclass = "";
					if(head.style){
						style = head.style;
					}
					if(head.class){
						stclass = head.class;
					}
					tr += "<th class='"+stclass+"' style='"+style+"'>"+head.name+"</th>";
					 
				}
				tr += "</tr>";
				$(thead).append(tr);
				$("#" + id).append(thead);
			}
		},
		renderTbody: function(id){
			var tbody = document.createElement("tbody");
			var tbodyId = "xtbody"+ Math.floor(Math.random() * 1000);
			$(tbody).attr("id", tbodyId)
			$("#" + id).append(tbody);
			this.render(tbodyId);
		},
		/**
		 * 根据key获取对象的值 obj={person:{name:"张三", age:23}} key="person.name" => 张三 key="person.age" => 23
		 * @method getValueByKey
		 * @param {obj} 对象. {key} 值
		 * @return 获取的值
		 **/
		getValueByKey: function(obj, key){
			if(key == undefined || key == "" || key == null){
				return obj;
			}
			var keys = key.split(".");
			var value = obj;
	 
			for(var i = 0; value && i < keys.length; i ++){
				value = value[keys[i]];
			}
			return value;
		},
		 
		tempHtml: "", //保存生成的html
		/**
		 * 渲染级联html
		 * @method render
		 * @param {id} 参数.
		 * @return
		 **/
		render: function(id){
			tempHtml = "<tr>";
			$("#" + id).html("");
			this.genHtml(this.option, id);
		},
	 
	 
		/**
		 * 根据参数option递归生成级联Html,将生成的Html保存到tempHtml变量
		 * @method genHtml
		 * @param {option} 参数.
		 * @return
		 **/
		genHtml: function(option, id){
			if(option.data && option.data.length > 0 && !option.stopCascade){ //级联显示
				for(var i = 0; i < option.data.length; i ++){
					var data = option.data[i];
					var style = "";
					var stclass = "";
					if(data.style){
						style = data.style;
					}
					if(data.class){
						stclass = data.class;
					}
					if(i == 0){
						tempHtml += "<td class='"+stclass+"' style='"+style+"' rowspan="+data.size+">"+data.name+"</td>"
					}else{
						tempHtml += "<tr><td class='"+stclass+"' style='"+style+"' rowspan="+data.size+">"+data.name+"</td>"
					}
					this.genHtml(data, id);
				}
			}else if(option.data && option.data.length > 0 && option.stopCascade){ //级联结束 渲染后面的数据
				for(var i = 0; i < option.data.length; i ++){
					var data = option.data[i];
					var style = "";
					var stclass = "";
					if(data.style){
						style = data.style;
					}
					if(data.class){
						stclass = data.class;
					}
					tempHtml += "<td class='"+stclass+"' style='"+style+"'>"+ this.getValueByKey(data, this.option.stopShowKey)+"</td>"
				}
				//懒得封装了，直接从下面else复制，做个标记，以后再优化
				tempHtml += "</tr>";
				var tempHtmlDom = $(tempHtml);
				if(this.option.buttons && this.option.buttons.length > 0){
					//生成操作按钮
					var tdHtmlBtnElement = document.createElement("td");
					for(var j = 0; j < this.option.buttons.length; j ++){
						var inputElement = document.createElement("input");
						$(inputElement).attr("type", "button");
						$(inputElement).attr("class", this.option.buttons[j].class);
						$(inputElement).attr("style", this.option.buttons[j].style);
						$(inputElement).attr("value", this.option.buttons[j].name);
						var self = this.option.buttons;
						$(inputElement).attr("selfData", JSON.stringify(option));
						$(inputElement).attr("selfbtnI", j);
						$(inputElement).on("click", function(e){
							self[$(this).attr("selfbtnI")].click(JSON.parse($(this).attr("selfData")));
						});
						$(tdHtmlBtnElement).append(inputElement);
					}
					$(tempHtmlDom).append(tdHtmlBtnElement);
				}
				 
				$("#" + id).append(tempHtmlDom);
				tempHtml = "";
				 
			}else{ //结尾的
				tempHtml += "</tr>";
				var tempHtmlDom = $(tempHtml);
				if(this.option.buttons && this.option.buttons.length > 0){
					//生成操作按钮
					var tdHtmlBtnElement = document.createElement("td");
					for(var j = 0; j < this.option.buttons.length; j ++){
						var inputElement = document.createElement("input");
						$(inputElement).attr("type", "button");
						$(inputElement).attr("class", this.option.buttons[j].class);
						$(inputElement).attr("style", this.option.buttons[j].style);
						$(inputElement).attr("value", this.option.buttons[j].name);
						var self = this.option.buttons;
						$(inputElement).attr("selfData", JSON.stringify(option));
						$(inputElement).attr("selfbtnI", j);
						$(inputElement).on("click", function(e){
							self[$(this).attr("selfbtnI")].click(JSON.parse($(this).attr("selfData")));
						});
						$(tdHtmlBtnElement).append(inputElement);
					}
					$(tempHtmlDom).append(tdHtmlBtnElement);
				}
				 
				$("#" + id).append(tempHtmlDom);
				tempHtml = "";
			}
		},
	 
		/**
		 * 为级联option每个元素设置size, size为其data里最底部元素的个数
		 * @method setSize
		 * @param {option} 参数.
		 * @return {option} 参数.
		 **/
		setSize: function(option){
			option.size = this.calculationSize(option);
			for(var i = 0; i < option.data.length; i ++){
				option.data[i].size = this.calculationSize(option.data[i]);
				if(option.data[i].data){
					option.data[i] = this.setSize(option.data[i]);
				}
			}
			return option;
		},
		/**
		 * 计算当前的级联option最底部元素的个数
		 * @method calculationSize
		 * @param {option} 参数.
		 * @return {sum} 个数.
		 **/
		calculationSize: function(option){
			if(option.data && option.data.length > 0 && !option.stopCascade){
				var sum = 0;
				for(var i = 0; i < option.data.length; i ++){
					sum += this.calculationSize(option.data[i]);
				}
				return sum;
			}else{
				return 1;
			}
		},
	}
	 
	})(jQuery, window, document);