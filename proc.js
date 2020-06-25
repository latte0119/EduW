function clearResultSpace(){
	rs=document.getElementById("resultSpace");
	while(rs.firstChild)rs.removeChild(rs.firstChild);
}

async function validateUsername(username){
	response= await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
	if(response.status==200)return true;
	else return false;
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



async function exec(){
	clearResultSpace();

	var username=document.form.username.value;
	

	var st=await validateUsername(username);
	if(!st){
		rs=document.getElementById("resultSpace");
		rs.innerHTML="<p>invalid username</p>";
		return;
	}
	

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