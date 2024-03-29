$('body').empty();

$('head').html('\
	<meta charset="utf-8">\
	<title>OA系统小工具</title> \
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"> \
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script> \
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>\
  	<meta name="viewport" content="width=device-width, initial-scale=1">\
  	<link rel="stylesheet" href="/resources/demos/style.css">\
  	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');


$('head').append('\
	<style type="text/css">\
		.my-custom-scrollbar {\
		position: relative;\
		height: 100%;\
		overflow: auto;\
		}\
		.table-wrapper-scroll-y {\
		display: block;\
		}\
	</style>' );


$('body').addClass("vsc-initialized");


$('body').append('\
	<script>\
		function sleep(milliseconds) {\
  			const date = Date.now();\
		    let currentDate = null;\
		    do {\
		    	currentDate = Date.now();\
		    } while (currentDate - date < milliseconds);\
		};\
	</script>');


// ---------------------------------------------- 办结

$('body').append('\
	<script>\
		function my_kill_ajax(idx,url,msg){\
			var xmlHttp = new XMLHttpRequest(); \
			xmlHttp.open( "GET", url, false );  \
			xmlHttp.send( null ); \
			el = document.createElement( "html" ); \
			el.innerHTML = xmlHttp.responseText;\
			frm = $("#frm",el);\
			frm_dict = {};\
			$("input",frm).each(function(){\
				frm_dict[$(this).attr("name")] = $(this).val();\
			});\
			frm_dict["yzArchivesIn.idea"] = msg;\
			$.post(\
			          "/archives/swAction!killWorkflow.action",\
			          frm_dict\
			      );\
		};\
	</script>');
$('body').append('\
	<script>\
		function my_kill(idx,url,msg){\
			my_kill_ajax(idx,url,msg);\
		}\
	</script>');

// ---------------------------------------------- 待办
// 页面信息

$('body').append('\
	<script>\
		function suspend_page_info(page){\
			xmlHttp = new XMLHttpRequest(); \
			xmlHttp.open( "GET", "/index/index!getMoreDb.action?bean.pageNo=" + page, false );  \
			xmlHttp.send( null );\
			el = document.createElement( "html" );\
			el.innerHTML = xmlHttp.responseText; \
			return el; \
		};\
	</script>');

// 页面总数
$('body').append('\
	<script>\
		function suspend_page_count(){\
			el = suspend_page_info(1); \
			text = $(".page .message",el).text();\
			$( "#suspend_info" ).text("检查:" +text);\
			return parseInt(text.split("/")[1].split("页")[0]); \
		}\
	</script>');
//选择所有
$('body').append('\
	<script>\
		function suspend_checkbox_all(tbody_id,status){\
			$("td input[name=\'check\']",$(tbody_id)).prop("checked",status);\
		}\
	</script>');



// 点击刷新
$('body').append('\
	<script>\
		function suspend_refresh(){\
			console.log("收文待办-获取列表");\
			$("#suspend_tbody").empty();\
			page_cnt = suspend_page_count();\
			console.log("共"+page_cnt+"页");\
			var idx =0;\
    		for (page=1;page<=page_cnt;page++) { \
    			$( "#suspend_progress" ).text(\
			      "进度：第"+page+"页，共"+page_cnt+"页"\
			    );\
			    console.log("第"+page+"页");\
				el = suspend_page_info(page);\
				tbl_tag = $("#listtable",el);\
				trs_tag = $("tr",tbl_tag);\
				if (trs_tag.length<2) break;\
				for (i=1;i<trs_tag.length;i++) {\
					idx += 1;\
					tr_tag = trs_tag[i];\
					tds_tag = $("td",tr_tag);\
					rst = {\
						"idx":idx,\
						"page":page,\
						"i":i,\
						"id":tr_tag.attributes["id"].textContent,\
						"url":tr_tag.attributes["url"].textContent,\
						"type":tds_tag[0].textContent.trim(),\
						"title":tds_tag[1].textContent.trim(),\
						"code":tds_tag[2].textContent.trim(),\
						"from":tds_tag[3].textContent.trim(),\
						"date":tds_tag[4].textContent.trim(),\
					};\
					$("#suspend_tbody").append(\' \
						<tr id="\'+rst.idx+\'" url="\'+rst.url+\'">\
				        <td><input type="checkbox" name="check"> </td>\
				        <th scope="row">\' + rst.idx + \'</th>\
				        <td>\'+rst.page+\'</td>\
				        <td>\'+rst.i+\'</td>\
				        <td>\'+rst.type+\'</td>\
				        <td>\'+rst.title+\'</td>\
				        <td>\'+rst.code+\'</td>\
				        <td>\'+rst.from+\'</td>\
				        <td>\'+rst.date+\'</td>\
				      </tr>\' \
					);\
				};\
			};\
		};\
	</script>');




//提交意见
$('body').append('\
	<script>\
		function suspend_comment(){\
			console.log("提交意见");\
			msg = $("#suspend_comment").val();\
			$("td input:checked",$("#suspend_tbody")).each(function(){\
				url = $(this).parent().parent()[0].attributes["url"].value;\
				console.log("第"+$(this).parent().parent()[0].attributes["id"].value+"个");\
				var xmlHttp = new XMLHttpRequest(); \
				xmlHttp.open( "GET", url, false );  \
				xmlHttp.send( null ); \
				el = document.createElement( "html" ); \
				el.innerHTML = xmlHttp.responseText; \
				var request = new XMLHttpRequest(); \
				request.open("POST", "/archives/swAction!submitWorkflow.action", false); \
				request.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"); \
				request.setRequestHeader("Accept-Language","zh-CN,zh;q=0.9,en;q=0.8,fr;q=0.7,zh-TW;q=0.6"); \
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); \
				request.setRequestHeader("Cache-Control", "max-age=0"); \
				request.setRequestHeader("Upgrade-Insecure-Requests", "1"); \
				urlEncodedDataPairs = []; \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.idea" ) + "=" + encodeURIComponent( msg )); \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.orgId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.orgId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.flowType" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.flowType\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.subflag" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.subflag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.fileViewRight" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.fileViewRight\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.zhengwenId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.zhengwenId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.taoHongTName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.taoHongTName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.gaozhiTName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.gaozhiTName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.fileType" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.fileType\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.flowStatusUrl" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.flowStatusUrl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.showNotion" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.showNotion\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.scheduledTime" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.scheduledTime\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isTimeout" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isTimeout\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.filelistGZId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.filelistGZId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "orgid" ) + "=" + encodeURIComponent( $("input[name=\'orgid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userId" ) + "=" + encodeURIComponent( $("input[name=\'userId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "curDeptId" ) + "=" + encodeURIComponent( $("input[name=\'curDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sendDeptId" ) + "=" + encodeURIComponent( $("input[name=\'sendDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.ideaRequired" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.ideaRequired\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "taohong" ) + "=" + encodeURIComponent( $("input[name=\'taohong\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "gaozhi" ) + "=" + encodeURIComponent( $("input[name=\'gaozhi\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userid" ) + "=" + encodeURIComponent( $("input[name=\'userid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userdeptid" ) + "=" + encodeURIComponent( $("input[name=\'userdeptid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "remindField" ) + "=" + encodeURIComponent( $("input[name=\'remindField\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "needGradeold" ) + "=" + encodeURIComponent( $("input[name=\'needGradeold\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "isModify" ) + "=" + encodeURIComponent( $("input[name=\'isModify\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.needGrade" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.needGrade\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.needGradeName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.needGradeName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.secretGrade" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.secretGrade\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.secretGradeName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.secretGradeName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.saveLimitId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.saveLimitId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.title" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.title\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inNumber" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inNumber\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inSort" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inSort\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inSerialNum" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inSerialNum\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.year" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.year\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.acceptDate" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.acceptDate\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingDeptId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingDeptName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingDeptName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.newcomingDeptName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.newcomingDeptName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingCode" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingCode\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingSort" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingSort\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingSortName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingSortName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactUser" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactUser\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactUserName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactUserName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactPhone" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactPhone\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.primaryDeptId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.primaryDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDeptIdBeforeName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDeptIdBeforeName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDept" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDept\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( "1" ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( "0" ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendbackReason" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendbackReason\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendId" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendId\']",el).val() ));  \
				postData = urlEncodedDataPairs.join( "&" ).replace( /%20/g, "+" ); \
				request.send(postData); \
			});\
			suspend_fresh();\
		}\
	</script>');


//办结束
$('body').append('\
	<script>\
		function suspend_kill_request(){\
			console.log("办结");\
			msg = $("#suspend_comment").val();\
			$("td input:checked",$("#suspend_tbody")).each(function(){\
				url = $(this).parent().parent()[0].attributes["url"].value;\
				console.log("第"+$(this).parent().parent()[0].attributes["idx"].value+"个");\
				var xmlHttp = new XMLHttpRequest(); \
				xmlHttp.open( "GET", url, false );  \
				xmlHttp.send( null ); \
				el = document.createElement( "html" ); \
				el.innerHTML = xmlHttp.responseText; \
				var request = new XMLHttpRequest(); \
				request.open("POST", "/archives/swAction!killWorkflow.action", false); \
				request.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"); \
				request.setRequestHeader("Accept-Language","zh-CN,zh;q=0.9,en;q=0.8,fr;q=0.7,zh-TW;q=0.6"); \
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); \
				request.setRequestHeader("Cache-Control", "max-age=0"); \
				request.setRequestHeader("Upgrade-Insecure-Requests", "1"); \
				urlEncodedDataPairs = []; \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.idea" ) + "=" + encodeURIComponent( msg )); \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.orgId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.orgId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.flowType" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.flowType\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.subflag" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.subflag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.fileViewRight" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.fileViewRight\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.zhengwenId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.zhengwenId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.taoHongTId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.taoHongTId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.taoHongTName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.taoHongTName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.gaozhiTid" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.gaozhiTid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.gaozhiTName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.gaozhiTName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.flowWriteId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.flowWriteId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.fileType" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.fileType\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.flowStatusUrl" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.flowStatusUrl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.showNotion" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.showNotion\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.scheduledTime" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.scheduledTime\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.startPeriod" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.startPeriod\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isTimeout" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isTimeout\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.ideaFiled" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.ideaFiled\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.filelistGZId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.filelistGZId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "orgid" ) + "=" + encodeURIComponent( $("input[name=\'orgid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userId" ) + "=" + encodeURIComponent( $("input[name=\'userId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "curDeptId" ) + "=" + encodeURIComponent( $("input[name=\'curDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sendDeptId" ) + "=" + encodeURIComponent( $("input[name=\'sendDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.getButtons" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.getButtons\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.ideaRequired" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.ideaRequired\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "taohong" ) + "=" + encodeURIComponent( $("input[name=\'taohong\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "gaozhi" ) + "=" + encodeURIComponent( $("input[name=\'gaozhi\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userid" ) + "=" + encodeURIComponent( $("input[name=\'userid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "username" ) + "=" + encodeURIComponent( $("input[name=\'username\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userdeptid" ) + "=" + encodeURIComponent( $("input[name=\'userdeptid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userdeptname" ) + "=" + encodeURIComponent( $("input[name=\'userdeptname\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "remindField" ) + "=" + encodeURIComponent( $("input[name=\'remindField\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "titleold" ) + "=" + encodeURIComponent( $("input[name=\'titleold\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "needGradeold" ) + "=" + encodeURIComponent( $("input[name=\'needGradeold\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "isModify" ) + "=" + encodeURIComponent( $("input[name=\'isModify\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.needGrade" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.needGrade\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.secretGrade" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.secretGrade\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.saveLimitId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.saveLimitId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.title" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.title\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inNumber" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inNumber\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inSort" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inSort\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.inSerialNum" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.inSerialNum\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.year" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.year\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.acceptDate" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.acceptDate\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingDeptId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingDeptName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingDeptName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingCode" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingCode\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.comingSort" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.comingSort\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isDossier" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isDossier\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactUser" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactUser\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactUserName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactUserName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.contactPhone" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.contactPhone\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.primaryDeptId" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.primaryDeptId\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.primaryDept" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.primaryDept\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDeptIdBeforeName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDeptIdBeforeName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDeptIdBefore" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDeptIdBefore\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDept" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDept\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.xbDeptName" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.xbDeptName\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.endPeriod" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.endPeriod\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.modifyCount" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.modifyCount\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendbackReason" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendbackReason\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.backremind" ) + "=" + encodeURIComponent( $("input[name=\'signIn.backremind\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendId" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendId\']",el).val() ));  \
				postData = urlEncodedDataPairs.join( "&" ).replace( /%20/g, "+" ); \
				request.send(postData); \
			});\
			suspend_comment();\
		}\
	</script>');

//待办-办结
$('body').append('\
	<script>\
		function suspend_kill(){\
			console.log("待办-办结");\
			msg = $("#suspend_comment").val();\
			select_tds = $("td input:checked",$("#suspend_tbody"));\
			for (i=0;i<select_tds.length;i++){\
				tr = $(select_tds[i]).parent().parent()[0];\
				url = tr.attributes["url"].value;\
				idx = tr.attributes["id"].value;\
				console.log("第"+idx+"个：开始");\
				my_kill(idx,url,msg);\
			};\
			sw_suspend_refresh();\
		}\
	</script>');

// ---------------------------------------------- 收文待办

// 收文待办-页面信息

$('body').append('\
	<script>\
		function sw_suspend_page_info(page){\
			xmlHttp = new XMLHttpRequest(); \
			xmlHttp.open( "GET", "/archives/gongwenCommonAction!todoList.action?bean.pageNo=" + page + "&model_id=030004003&queryCondition.gongwenType=SW", false );  \
			xmlHttp.send( null );\
			el = document.createElement( "html" );\
			el.innerHTML = xmlHttp.responseText; \
			return el; \
		};\
	</script>');

// 收文待办-页面总数
$('body').append('\
	<script>\
		function sw_suspend_page_count(){\
			el = sw_suspend_page_info(1); \
			text = $(".page .message",el).text();\
			$( "#sw_suspend_info" ).text("检查:" +text);\
			return parseInt(text.split("/")[1].split("页")[0]); \
		}\
	</script>');
//收文待办-选择所有
$('body').append('\
	<script>\
		function sw_suspend_checkbox_all(tbody_id,status){\
			$("td input[name=\'check\']",$(tbody_id)).prop("checked",status);\
		}\
	</script>');

// 收文待办-点击刷新
$('body').append('\
	<script>\
		function sw_suspend_refresh(){\
			console.log("收文待办-获取列表");\
			$("#sw_suspend_tbody").empty();\
			page_cnt = sw_suspend_page_count();\
			console.log("共"+page_cnt+"页");\
    		for (page=1;page<=page_cnt;page++) { \
    			$( "#sw_suspend_progress" ).text(\
			      "进度：第"+page+"页，共"+page_cnt+"页"\
			    );\
			    console.log("第"+page+"页");\
				el = sw_suspend_page_info(page);\
				tbl_tag = $("#listtable",el);\
				trs_tag = $("tr",tbl_tag);\
				if (trs_tag.length<2) break;\
				for (i=1;i<trs_tag.length;i++) {\
					tr_tag = trs_tag[i];\
					tds_tag = $("td",tr_tag);\
					idx =  parseInt(tds_tag[0].textContent.trim());\
					rst = {\
						"idx":idx,\
						"page":page,\
						"i":i,\
						"url":tr_tag.attributes["url"].textContent + "&yzArchivesIn.flowWriteId=" + tr_tag.attributes["id"].textContent,\
						"type":tds_tag[1].textContent.trim(),\
						"title":tds_tag[2].textContent.trim(),\
						"code":tds_tag[3].textContent.trim(),\
						"from":tds_tag[4].textContent.trim(),\
						"date":tds_tag[5].textContent.trim(),\
					};\
					$("#sw_suspend_tbody").append(\' \
						<tr idx="\'+rst.idx+\'" url="\'+rst.url+\'">\
				        <td><input type="checkbox" name="check"> </td>\
				        <th scope="row">\' + rst.idx + \'</th>\
				        <td>\'+rst.page+\'</td>\
				        <td>\'+rst.i+\'</td>\
				        <td>\'+rst.type+\'</td>\
				        <td>\'+rst.title+\'</td>\
				        <td>\'+rst.code+\'</td>\
				        <td>\'+rst.from+\'</td>\
				        <td>\'+rst.date+\'</td>\
				      </tr>\' \
					);\
				};\
			};\
		};\
	</script>');

//收文待办-办结束
$('body').append('\
	<script>\
		function sw_suspend_kill(){\
			console.log("收文待办-办结");\
			msg = $("#sw_suspend_comment").val();\
			select_tds = $("td input:checked",$("#sw_suspend_tbody"));\
			for (i=0;i<select_tds.length;i++){\
				tr = $(select_tds[i]).parent().parent()[0];\
				url = tr.attributes["url"].value;\
				idx = tr.attributes["idx"].value;\
				console.log("第"+idx+"个：开始");\
				my_kill_ajax(idx,url,msg);\
			};\
			sw_suspend_refresh();\
		}\
	</script>');


// ---------------------------------------------- 待阅

// 待阅-页面信息

$('body').append('\
	<script>\
		function dy_suspend_page_info(page){\
			xmlHttp = new XMLHttpRequest(); \
			xmlHttp.open( "GET", "/indexController/getMoreDy.done?pageNo="+page, false );  \
			xmlHttp.send( null );\
			el = document.createElement( "html" );\
			el.innerHTML = xmlHttp.responseText; \
			return el; \
		};\
	</script>');

// 待阅-页面总数
$('body').append('\
	<script>\
		function dy_suspend_page_count(){\
			el = dy_suspend_page_info(1); \
			text = $(".page .message",el).text();\
			$( "#dy_suspend_info" ).text("检查:" +text);\
			return parseInt(text.split("/")[1].split("页")[0]); \
		}\
	</script>');
//待阅-选择所有
$('body').append('\
	<script>\
		function dy_suspend_checkbox_all(tbody_id,status){\
			$("td input[name=\'check\']",$(tbody_id)).prop("checked",status);\
		}\
	</script>');

// 待阅-点击刷新
$('body').append('\
	<script>\
		function dy_suspend_refresh(){\
			console.log("待阅-获取列表");\
			$("#dy_suspend_tbody").empty();\
			page_cnt = dy_suspend_page_count();\
			console.log("共"+page_cnt+"页");\
    		for (page=1;page<=page_cnt;page++) { \
    			$( "#dy_suspend_progress" ).text(\
			      "进度：第"+page+"页，共"+page_cnt+"页"\
			    );\
			    console.log("第"+page+"页");\
				el = dy_suspend_page_info(page);\
				tbl_tag = $("#orderTabledy",el);\
				trs_tag = $("tr",tbl_tag);\
				if (trs_tag.length<2) break;\
				for (i=1;i<trs_tag.length;i++) {\
					tr_tag = trs_tag[i];\
					tds_tag = $("td",tr_tag);\
					idx =  parseInt(tds_tag[0].textContent.trim());\
					rst = {\
						"idx":idx,\
						"page":page,\
						"i":i,\
						"type":tds_tag[1].textContent.trim(),\
						"title":tds_tag[2].textContent.trim(),\
						"from":tds_tag[3].textContent.trim(),\
						"date":tds_tag[4].textContent.trim(),\
						"uid":tr_tag.getAttribute("id"),\
					};\
					$("#dy_suspend_tbody").append(\' \
						<tr idx="\'+rst.idx+\'" uid="\'+rst.uid+\'">\
				        <td><input type="checkbox" name="check"> </td>\
				        <th scope="row">\' + rst.idx + \'</th>\
				        <td>\'+rst.page+\'</td>\
				        <td>\'+rst.i+\'</td>\
				        <td>\'+rst.type+\'</td>\
				        <td>\'+rst.title+\'</td>\
				        <td>\'+rst.from+\'</td>\
				        <td>\'+rst.date+\'</td>\
				      </tr>\' \
					);\
				};\
				sleep(1000);\
			};\
		};\
	</script>');

//待阅-点击阅毕
$('body').append('\
	<script>\
		function dy_suspend_kill(){\
			console.log("待阅-办结");\
			frm_dict = {"keywords":[],"sendIds":[]};\
			select_tds = $("td input:checked",$("#dy_suspend_tbody"));\
			for (i=0;i<select_tds.length;i++){\
				tr = $(select_tds[i]).parent().parent()[0];\
				uid = tr.attributes["uid"].value;\
				idx = tr.attributes["idx"].value;\
				console.log("第"+idx+"个：开始");\
				frm_dict["keywords"].push("收文");\
				frm_dict["sendIds"].push(uid);\
			};\
			frm_dict["keywords"] = frm_dict["keywords"].join(",");\
			frm_dict["sendIds"] = frm_dict["sendIds"].join(",");\
			$.post(\
			          "/index/index!updateYb.action",\
			          frm_dict\
			      );\
			dy_suspend_refresh();\
		}\
	</script>');
// ---------------------------------------------- UI

$('body').append('<div class="container"><h1> OA系统小工具,by莫运政@风险管理部  </h1></div><div><h4>(注：仅用于2020年10月一次性处理积压的收文，之后的收文请不要使用该工具)</h4></div>\
	');
//<a class="btn btn-large btn-success" onclick="suspend_apply()">提交办理</a>\
$('body').append('\
	<div class-"container">\
		<ul class="nav nav-tabs md-tabs" id="myTabMD" role="tablist">\
			<li class="nav-item">\
				<a class="nav-link active" id="db-tab-md" data-toggle="tab" href="#suspend" role="tab" aria-controls="home-md"\
			aria-selected="true">待办</a>\
			</li>\
			<li class="nav-item">\
				<a class="nav-link" id="sw-tab-md" data-toggle="tab" href="#sw_suspend" role="tab" aria-controls="profile-md"\
			aria-selected="false">收文待办</a>\
			</li>\
			<li class="nav-item">\
				<a class="nav-link" id="sw-tab-md" data-toggle="tab" href="#dy_suspend" role="tab" aria-controls="profile-md"\
			aria-selected="false">待阅</a>\
			</li>\
		</ul>\
	</div>\
	<div class-"container" id="my_last_el">\
		<div class="tab-content card pt-5" id="myTabContentMD">\
			<div class="tab-pane fade show active" id="suspend" role="tabpanel" aria-labelledby="db-tab-md">\
				<div class="row"> \
					<a class="btn btn-large btn-success" onclick="suspend_refresh()">重新获取(待办)</a>\
					<div id="suspend_info"> </div> \
					<div id="suspend_progress"></div>\
				</div>\
				<div class="row">\
					<input id="suspend_comment" type="text" value="已阅。">\
					\
					<a class="btn btn-large btn-success" onclick="suspend_kill()">点击办结</a>\
				</div>\
			</div>\
			<div class="tab-pane fade" id="sw_suspend" role="tabpanel" aria-labelledby="sw-tab-md">\
				<div class="row"> \
					<a class="btn btn-large btn-success" onclick="sw_suspend_refresh()">重新获取(收文待办)</a>\
					<div id="sw_suspend_info"> </div> \
					<div id="sw_suspend_progress"></div>\
				</div>\
				<div class="row">\
					<input id="sw_suspend_comment" type="text" value="已阅。">\
					<a class="btn btn-large btn-success" onclick="sw_suspend_kill()">点击办结</a>\
				</div>\
			</div>\
			<div class="tab-pane fade" id="dy_suspend" role="tabpanel" aria-labelledby="sw-tab-md">\
				<div class="row"> \
					<a class="btn btn-large btn-success" onclick="dy_suspend_refresh()">重新获取(待阅)</a>\
					<a class="btn btn-large btn-success" onclick="dy_suspend_kill()">点击阅毕</a>\
					<div id="dy_suspend_info"> </div> \
					<div id="dy_suspend_progress"></div>\
				</div>\
			</div>\
		</div>\
	</div>');
$('#suspend').append('\
	<div class="table-wrapper-scroll-y my-custom-scrollbar">\
	  <table class="table table-bordered table-striped mb-0">\
	    <thead>\
	      <tr>\
	      	<th scope="col"> <input type="checkbox" name="suspend_check" onclick="suspend_checkbox_all(\'#suspend_tbody\',this.checked)">全选 </th>\
			<th scope="col">序号</th>\
			<th scope="col">页码</th>\
			<th scope="col">顺序</th>\
			<th scope="col">流程类型</th>\
			<th scope="col">标题</th>\
			<th scope="col">文号</th>\
			<th scope="col">前一办理人</th>\
			<th scope="col">时间</th>\
	      </tr>\
	    </thead>\
	    <tbody id="suspend_tbody">\
	    </tbody>\
	  </table>\
	</div>');
$('#sw_suspend').append('\
	<div class="table-wrapper-scroll-y my-custom-scrollbar">\
	  <table class="table table-bordered table-striped mb-0">\
	    <thead>\
	      <tr>\
	      	<th scope="col"> <input type="checkbox" name="sw_suspend_check" onclick="sw_suspend_checkbox_all(\'#sw_suspend_tbody\',this.checked)">全选 </th>\
			<th scope="col">序号</th>\
			<th scope="col">页码</th>\
			<th scope="col">顺序</th>\
			<th scope="col">流程类型</th>\
			<th scope="col">标题</th>\
			<th scope="col">文号</th>\
			<th scope="col">前一办理人</th>\
			<th scope="col">时间</th>\
	      </tr>\
	    </thead>\
	    <tbody id="sw_suspend_tbody">\
	    </tbody>\
	  </table>\
	</div>');

$('#dy_suspend').append('\
	<div class="table-wrapper-scroll-y my-custom-scrollbar">\
	  <table class="table table-bordered table-striped mb-0">\
	    <thead>\
	      <tr>\
	      	<th scope="col"> <input type="checkbox" name="dy_suspend_check" onclick="dy_suspend_checkbox_all(\'#dy_suspend_tbody\',this.checked)">全选 </th>\
			<th scope="col">序号</th>\
			<th scope="col">页码</th>\
			<th scope="col">顺序</th>\
			<th scope="col">类型</th>\
			<th scope="col">标题</th>\
			<th scope="col">发送人</th>\
			<th scope="col">发送时间</th>\
	      </tr>\
	    </thead>\
	    <tbody id="dy_suspend_tbody">\
	    </tbody>\
	  </table>\
	</div>');
