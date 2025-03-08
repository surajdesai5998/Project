let  taxSwitch=document.getElementById("flexSwitchCheck");

taxSwitch.addEventListener("click",()=>{
  let taxInfo=document.getElementsByClassName("tax-Info");
  for(info of taxInfo){
    if(info.style.display!="inline"){
        info.style.display="inline";
    }else{  
        info.style.display="none";
    }
  }
});


taxSwitch.addEventListener("click",()=>{
  let priceInfo=document.getElementsByClassName("price");
for(info of priceInfo){
  if(info.style.display!="none"){
      info.style.display="none";
  }else{  
      info.style.display="inline";
  }
}  
});
