
var ow = 30
var oh = 30
function drawCtx(ctx, state) {
    //ctx.clearRect(0,0,800,600)
    //state.im.style.transform="rotate("+state.x+"deg)"
    ctx.save()
    ctx.translate(state.x,state.y)
    ctx.rotate(state.dx+state.dy)
    ctx.drawImage(state.im,-50,-70,100,140)
    ctx.restore()
    //ctx.fillRect(state.x,state.y,ow,oh)
    state.dx = state.dx + state.ddx
    state.dy = state.dy + state.ddy
    state.dx *= 0.9998
    state.dy *= 0.9998
    
    if((state.x-40<0 && state.dx<0)|| (state.x+40>1500 && state.dx>0)) {
        state.dx = -state.dx
    }
    state.x = state.x + state.dx
    if((state.y-60<0 && state.dy<0)|| (state.y+60>900 && state.dy>0)) {
        state.dy = -state.dy
    }
    state.y = state.y + state.dy
    window.requestAnimationFrame(()=>drawCtx(ctx,state))
}
export function setupCV(element) {
    var im = document.getElementById("gab")
    var cv = document.createElement('canvas')
    cv.width = 1500
    cv.height = 900
    cv.style.borderWidth = 1
    cv.style.borderColor = "black"
    cv.style.borderStyle = "solid" 
    cv.style.margin = "auto"   
    var state = {x:100,y:100,dx:0.1,dy:0.1,ddx:0,ddy:0.1,im:im}
    let right = false
    let left = false

    function kdHandler(e) { 
        console.log(e.key)
        if(e.key === "ArrowRight") {
            right = true
            state.ddx += 0.05
        }
        if(e.key === "ArrowLeft") {
            left = true
            state.ddx -= 0.05
        }
        if(e.key === "ArrowUp") {
            right = true
            state.ddy -= 0.05
        }
        if(e.key === "ArrowDown") {
            left = true
            state.ddy += 0.05
        }
        console.log(state.ddx + " - " + state.ddy)
    }
    

    document.addEventListener("keydown",kdHandler, false)
    var ctx = cv.getContext("2d")
    ctx.fillStyle = "red"
    function draw() {
        drawCtx(ctx,state)
    }
    window.requestAnimationFrame(draw)
    element.appendChild(cv)
}