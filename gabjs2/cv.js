
var w = 1500
var h = 900
class Gab{
    constructor(im,x,y,dx,dy,w,h) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.im = im
        this.ddx = 0
        this.ddy = 0.1
        this.w = w
        this.h = h
        this.bumpedonce = false
        this.bumped = false
        this.selected = false
    }
    static w = 25
    static h = 35

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x,this.y)
        ctx.rotate(0.01*(this.x+this.y))
        ctx.drawImage(this.im,-this.w,-this.h,2*this.w,2*this.h)
        ctx.restore()
        if(this.selected) {
            console.log(this.x)
            ctx.strokeStyle = "red"
            ctx.strokeRect(this.x-this.w,this.y-this.h, 2* this.w, 2* this.h)
        }
    }

    update() {
        
        if((this.x+this.dx-this.w<0 && this.dx<0)|| (this.x+this.dx+this.w>w && this.dx>0)) {
            this.dx = -this.dx
        } else {
            this.dx = this.dx + this.ddx
        }
        if((this.y+this.dy-this.h<0 && this.dy<0)|| (this.y+this.dy+this.h>h && this.dy>0)) {
            this.dy = -this.dy
        } else {
            this.dy = this.dy + this.ddy
        }
        this.dx *= 0.999
        this.dy *= 0.999
        this.x = this.x + this.dx
        this.y = this.y + this.dy
    }

    collides(other) {
       if(this.bumped && other.bumped) {
            this.bumped = false
            other.bumped = false
            return false 
        }
        
        var olddistx = this.x - other.x
        var olddisty = this.y - other.y
        /*if(Math.abs(olddistx)<(this.w+other.w) && Math.abs(olddisty)<(this.h+other.h)) {
            if(this.x>other.x) {
                if(this.x+this.w<w)
                    this.x += this.w
                if(other.x-other.w>0)   
                    other.x -= other.w
            } else {
                if(this.x-this.w >0)
                    this.x -= this.w
                if(other.x+other.w < w)
                    other.x += other.w
            }
            if(this.y>other.y) {
                if(this.y+this.h < h)
                    this.y += this.h
                if(other.y - other.h>0)
                    other.y -= other.h
            } else {
                if(this.y-this.h>0)
                    this.y -= this.h
                if(other.y +other.h< h)
                    other.y += other.h
            }
        }*/
        var newx = this.x + this.dx
        var newy = this.y + this.dy
        var othernewx = other.x + other.dx
        var othernewy = other.y + other.dy
        var distx = newx-othernewx
        var disty = newy-othernewy
        if(Math.abs(distx)<(this.w+other.w) && Math.abs(disty)<(this.h+other.h)) {
            this.bumpedonce = true
            other.bumpedonce = true
            let olddist2 = olddistx * olddistx + olddisty * olddisty
            let k = ((this.dx-other.dx) * olddistx + (this.dy-other.dy) * olddisty)/olddist2
            let kother = ((other.dx-this.dx) * olddistx + (other.dy-this.dy) * olddisty)/olddist2
            //console.log(k+" "+kother)

           // if(k<0) {
            this.dx -= olddistx*(k)
            this.dy -= olddisty*(k)
           // }
          //  if(kother>0) {
            other.dx -= olddistx*1.01*(kother)
            other.dy -= olddisty*1.01*(kother)
           // }
            return true
        }
        return false
    }
}

function drawCtx(ctx, state) {
    ctx.clearRect(0,0,w,h)
    for(let i = 0; i < state.ngabs; i++) {
        state.gabs[i].update();
    }
    for(let i = 0; i < state.ngabs; i++) {
        for(let j = i+1; j< state.ngabs; j++) {
            if(state.gabs[i].collides(state.gabs[j])) {
               // console.log(i+"//"+j)
            }
        }
    }
    state.gabs.forEach((gab) => {
      gab.draw(ctx);
    });
    window.requestAnimationFrame(()=>drawCtx(ctx,state))
}
export function setupCV(element) {
    var im = document.getElementById("gab")
    var cv = document.createElement('canvas')
    var gabs = []
    var ngabs = 15
    for(var i = 0; i < ngabs; i++) {
        gabs.push(new Gab(im,(100+i*110) %w,(100+i*130) %h,0.05*i,0.02*i,25+5*i,35+5*i))
    }
    
    var selected = 0
    cv.width = w
    cv.height = h
    cv.style.borderWidth = 1
    cv.style.borderColor = "black"
    cv.style.borderStyle = "solid" 
    cv.style.margin = "auto"   
    var state = {gabs:gabs, ngabs:ngabs}
    

    function kdHandler(e) { 
        console.log(e.key)
        if(e.key === "ArrowRight") {
            state.gabs[selected].dx += 1
        }
        if(e.key === "ArrowLeft") {
            state.gabs[selected].dx -= 1
        }
        if(e.key === "ArrowUp") {
            state.gabs[selected].dy -= 1
        }
        if(e.key === "ArrowDown") {
            state.gabs[selected].dy += 1
        }
        if(e.key === "n") {
            state.gabs[selected].selected = false
            selected = (selected+1) % ngabs
            state.gabs[selected].selected = true
        }
        //console.log(gab0.ddx + " - " + state.ddy)
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