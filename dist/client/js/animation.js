let observe = new IntersectionObserver((e)=>{
    e.forEach((animatedObj)=>{
        if(animatedObj.isIntersecting){
            animatedObj.target.style.opacity = 1;
            animatedObj.target.style.transform = "translateY(0)";
        }
    })
})

let animatedObjs = document.querySelectorAll('.animated')
animatedObjs.forEach((animatedObj)=>{
    animatedObj.style.opacity = 0;
    animatedObj.style.transform = "translateY(1vh)";
    animatedObj.style.transition = "1s";
    observe.observe(animatedObj)
})