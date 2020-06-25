function clearResultSpace(){
	rs=document.getElementById("resultSpace");
	while(rs.firstChild)rs.removeChild(rs.firstChild);
}

function getECRList(){
	return fetch(`https://codeforces.com/api/contest.list`)
	.then(response=>{
		return response.json();
	})
	.then(json=>{
		var cnt=0;

		var arr=[];
		for(var i in json.result){
			c=json.result[i];
			
			if(c.phase!='FINISHED'){
				continue;
			}
			
			spl=c.name.split(" ");
			
			if(spl[0]!='Educational'){
				continue;
			}
			arr.push(c.id);
		}

		return arr.reverse();
	});
}



function exec(){
	clearResultSpace();

	var username=document.form.username.value;

	getECRList()
	.then(arr=>{
		fetch(`https://codeforces.com/api/contest.status`)

		var table=document.createElement("table");

		table.border="1";

		row=table.insertRow(-1);
		cell=row.insertCell(-1);
		cell.appendChild(document.createTextNode("Contest Name"));
		cell.style.backgroundColor="#ddd";
		
		for(var i in arr){
			row=table.insertRow(-1);
			cell=row.insertCell(-1);
			cell.appendChild(document.createTextNode(arr[i]));
		}

		document.getElementById("resultSpace").appendChild(table);
	});
}