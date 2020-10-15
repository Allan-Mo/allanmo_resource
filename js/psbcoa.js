$('body').empty();

$('head').html('\
	<meta charset="utf-8">\
	<title>OA系统小工具</title> \
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"> \
	<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script> \
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script> \
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script>\
  	<meta name="viewport" content="width=device-width, initial-scale=1">\
  	<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">\
  	<link rel="stylesheet" href="/resources/demos/style.css">\
  	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\
	<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js"></script>\
  	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>');


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

// 初始化
$('body').addClass("vsc-initialized");
$('body').append('\
	<script>\
		var myz_rst={};\
	</script>');
// 页面信息

$('body').append('\
	<script>\
		function page_info(page){\
			xmlHttp = new XMLHttpRequest(); \
			xmlHttp.open( "GET", "https://211.156.194.132/index/index!getMoreDb.action?bean.pageNo=" + page, false );  \
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
			el = page_info(1); \
			text = $(".page .message",el).text();\
			$( "#suspend_info" ).text("检查:" +text);\
			return parseInt(text.split("/")[1].split("页")[0]); \
		}\
	</script>');
//选择所有
$('body').append('\
	<script>\
		function checkbox_all(tbody_id,status){\
			$("td input[name=\'check\']",$(tbody_id)).prop("checked",status);\
		}\
	</script>');



// 点击刷新
$('body').append('\
	<script>\
		function my_suspend(){\
			myz_rst.all_url = [] ;\
			$("#suspend_tbody").empty();\
			page_cnt = suspend_page_count();\
			var idx =0;\
    		for (let page=1;page<=page_cnt;page++) { \
    			$( "#suspend_progress" ).text(\
			      "进度：第"+page+"页，共"+page_cnt+"页"\
			    );\
			    console.log("第"+page+"页");\
				el = page_info(page);\
				tbl_tag = $("#listtable",el);\
				trs_tag = $("tr",tbl_tag);\
				if (trs_tag.length<2) break;\
				for (let i=1;i<trs_tag.length;i++) {\
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
					myz_rst[idx.toString()]=rst;\
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
			}\
		}\
	</script>');

// 提交给傅老师


//提交意见
$('body').append('\
	<script>\
		function suspend_apply(user){\
			console.log("提交意见");\
			msg = $("#suspend_comment").val();\
			$("td input:checked",$("#suspend_tbody")).each(function(){\
				url = "https://211.156.194.132" + $(this).parent().parent()[0].attributes["url"].value;\
				console.log("第"+$(this).parent().parent()[0].attributes["id"].value+"个");\
				var xmlHttp = new XMLHttpRequest(); \
				xmlHttp.open( "GET", url, false );  \
				xmlHttp.send( null ); \
				el = document.createElement( "html" ); \
				el.innerHTML = xmlHttp.responseText; \
				var request = new XMLHttpRequest(); \
				request.open("POST", "https://211.156.194.132/archives/swAction!submitWorkflow.action", false); \
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
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "__checkbox_yzArchivesIn.isInternalControl" ) + "=" + encodeURIComponent( $("input[name=\'__checkbox_yzArchivesIn.isInternalControl\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendbackReason" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendbackReason\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "signIn.sendId" ) + "=" + encodeURIComponent( $("input[name=\'signIn.sendId\']",el).val() ));  \
				postData = urlEncodedDataPairs.join( "&" ).replace( /%20/g, "+" ); \
				request.send(postData); \
				\
				workitemid = $("input[name=\'yzArchivesIn.flowWriteId\']",el).val();\
				\
				el.innerHTML = request.responseText;\
				examinetag = $("#wfoperatedid",el);\
				if (examinetag.length==0) return;\
				examinetag = examinetag.val();\
				examinetag_val = $("input[name=\'examinetag_"+examinetag+"\']",el);\
				if (examinetag_val.length==0) return;\
				examinetag_val = examinetag_val.val();\
				var request = new XMLHttpRequest(); \
				request.open("POST", "https://211.156.194.132/archives/swAction!submitWorkflow.action", false); \
				request.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"); \
				request.setRequestHeader("Accept-Language","zh-CN,zh;q=0.9,en;q=0.8,fr;q=0.7,zh-TW;q=0.6"); \
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"); \
				request.setRequestHeader("Cache-Control", "max-age=0"); \
				request.setRequestHeader("Upgrade-Insecure-Requests", "1"); \
				\
				docid =$("input[name=\'docid\']",el).val();\
				urlEncodedDataPairs = []; \
				urlEncodedDataPairs.push( encodeURIComponent( "idea" ) + "=" + encodeURIComponent( msg )); \
				urlEncodedDataPairs.push( encodeURIComponent( "examinetag_"+ examinetag ) + "=" + encodeURIComponent( examinetag_val ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "wfoperateid" ) + "=" + encodeURIComponent( examinetag ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "selectuserlist" ) + "=" + encodeURIComponent( examinetag + "=|$|"+user+"|$|##wd*undefined|d*undefined|h*undefined#4," ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userlist" ) + "=" + encodeURIComponent( "13698128602378440=|$|033020002*080924225244344|$|033020005*ff80808122082c8801220c7a8d88227b|$|033020006*080924225244350|$|033020007*ff8080814a3df62f014a4b94c9290051|$|033020009*ff8080814a3df9fd014a4bb51555007b|$|033020010*ff80808129e539600129f2ba9f634bd4|$|033020011*8a829bac30fe8dae0131098b375a4d23|$|" ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sql" ) + "=" + encodeURIComponent( "delete yz_waitdo_noflow t where t.recordid=\'"+ +"\' and t.do_url like \'%swAction%\'" ));  \
				\
				urlEncodedDataPairs.push( encodeURIComponent( "flag" ) + "=" + encodeURIComponent( $("input[name=\'flag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "relatype" ) + "=" + encodeURIComponent( $("input[name=\'relatype\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "workitemid" ) + "=" + encodeURIComponent( $("input[name=\'workitemid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userid" ) + "=" + encodeURIComponent( $("input[name=\'userid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "deptid" ) + "=" + encodeURIComponent( $("input[name=\'deptid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "filetypeid" ) + "=" + encodeURIComponent( $("input[name=\'filetypeid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "recordid" ) + "=" + encodeURIComponent( $("input[name=\'recordid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "docid" ) + "=" + encodeURIComponent( $("input[name=\'docid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "title" ) + "=" + encodeURIComponent( $("input[name=\'title\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "idea" ) + "=" + encodeURIComponent( $("input[name=\'idea\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "subflag" ) + "=" + encodeURIComponent( $("input[name=\'subflag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "shunxubanname" ) + "=" + encodeURIComponent( $("input[name=\'shunxubanname\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sign" ) + "=" + encodeURIComponent( $("input[name=\'sign\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "selectdeptlist" ) + "=" + encodeURIComponent( $("input[name=\'selectdeptlist\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "wfleveid" ) + "=" + encodeURIComponent( $("input[name=\'wfleveid\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "userflag" ) + "=" + encodeURIComponent( $("input[name=\'userflag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sendsms" ) + "=" + encodeURIComponent( $("input[name=\'sendsms\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "settime" ) + "=" + encodeURIComponent( $("input[name=\'settime\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "flowtime" ) + "=" + encodeURIComponent( $("input[name=\'flowtime\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "remind" ) + "=" + encodeURIComponent( $("input[name=\'remind\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "para" ) + "=" + encodeURIComponent( $("input[name=\'para\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "examinetag" ) + "=" + encodeURIComponent( $("input[name=\'examinetag\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "subflowlist" ) + "=" + encodeURIComponent( $("input[name=\'subflowlist\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "subflowdeptlist" ) + "=" + encodeURIComponent( $("input[name=\'subflowdeptlist\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "tableandidname" ) + "=" + encodeURIComponent( $("input[name=\'tableandidname\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "extendattr" ) + "=" + encodeURIComponent( $("input[name=\'extendattr\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "attr" ) + "=" + encodeURIComponent( $("input[name=\'attr\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "attr1" ) + "=" + encodeURIComponent( $("input[name=\'attr1\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "attr2" ) + "=" + encodeURIComponent( $("input[name=\'attr2\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "deptorder" ) + "=" + encodeURIComponent( $("input[name=\'deptorder\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlone" ) + "=" + encodeURIComponent( $("input[name=\'sqlone\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqltwo" ) + "=" + encodeURIComponent( $("input[name=\'sqltwo\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlthree" ) + "=" + encodeURIComponent( $("input[name=\'sqlthree\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlfour" ) + "=" + encodeURIComponent( $("input[name=\'sqlfour\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlfive" ) + "=" + encodeURIComponent( $("input[name=\'sqlfive\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlsix" ) + "=" + encodeURIComponent( $("input[name=\'sqlsix\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlseven" ) + "=" + encodeURIComponent( $("input[name=\'sqlseven\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqleight" ) + "=" + encodeURIComponent( $("input[name=\'sqleight\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlnine" ) + "=" + encodeURIComponent( $("input[name=\'sqlnine\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlten" ) + "=" + encodeURIComponent( $("input[name=\'sqlten\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "sqlobj" ) + "=" + encodeURIComponent( $("input[name=\'sqlobj\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "iskeepwrite" ) + "=" + encodeURIComponent( $("input[name=\'iskeepwrite\']",el).val() ));  \
				urlEncodedDataPairs.push( encodeURIComponent( "serverType" ) + "=" + encodeURIComponent( $("input[name=\'serverType\']",el).val() ));  \
				postData = urlEncodedDataPairs.join( "&" ).replace( /%20/g, "+" ); \
				request.send(postData); \
			});\
			my_suspend();\
		}\
	</script>');


$('body').append('<div class="container"><h1> OA系统小工具,by莫运政@风险管理部  </h1></div>\
	');
$('body').append('\
	<div class-"container">\
		<ul class="nav nav-tabs md-tabs" id="myTabMD" role="tablist">\
			<li class="nav-item">\
				<a class="nav-link active" id="home-tab-md" data-toggle="tab" href="#suspend" role="tab" aria-controls="home-md"\
			aria-selected="true">待办</a>\
			</li>\
			<li class="nav-item">\
				<a class="nav-link" id="profile-tab-md" data-toggle="tab" href="#done" role="tab" aria-controls="profile-md"\
			aria-selected="false">已办</a>\
			</li>\
		</ul>\
	</div>\
	<div class-"container" id="my_last_el">\
		<div class="tab-content card pt-5" id="myTabContentMD">\
			<div class="tab-pane fade show active" id="suspend" role="tabpanel" aria-labelledby="home-tab-md">\
				<div class="row"> \
					<a class="btn btn-large btn-success" onclick="my_suspend()">重新获取</a>\
					<div id="suspend_info"> </div> \
					<div id="suspend_progress"></div>\
				</div>\
				<div class="row">\
					<input id="suspend_comment" type="text" value="已阅。">\
					<a class="btn btn-large btn-success" onclick="suspend_apply()">提交意见</a>\
					<div>旧文件提交：</div>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020004\*8a829b8e384aadfe0138551fca700d4c\')">提交傅鹏佳</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020002\*080924225244344\')">提交张璋</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020005\*ff80808122082c8801220c7a8d88227b\')">提交陈灏</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020007\*ff8080814a3df62f014a4b94c9290051\')">提交陈海吟</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020009\*ff8080814a3df9fd014a4bb51555007b\')">提交王龙民</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020010\*ff80808129e539600129f2ba9f634bd4\')">提交刘凯</a>\
					<a class="btn btn-large btn-success" onclick="suspend_apply(\'033020011\*8a829bac30fe8dae0131098b375a4d23\')">提交乔木青</a>\
				</div>\
			</div>\
			<div class="tab-pane fade" id="done" role="tabpanel" aria-labelledby="profile-tab-md">\
				<a class="btn btn-large btn-success" onclick="my_done()">重新获取</a>\
			</div>\
		</div>\
	</div>');
$('#suspend').append('\
	<div class="table-wrapper-scroll-y my-custom-scrollbar">\
	  <table class="table table-bordered table-striped mb-0">\
	    <thead>\
	      <tr>\
	      	<th scope="col"> <input type="checkbox" name="suspend_check" onclick="checkbox_all(\'#suspend_tbody\',this.checked)">全选 </th>\
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


