import React, {Component} from "react";
import ReactDOM, { render } from "react-dom";
import "./BFS.css";

export default class BFS extends React.Component{
    constructor(props){
        super(props);
        this.state={
            hexSize: 20,
            hexOrigin: {x: 30,y: 30}
        }

    }

    componentWillMount(){
        let hexParameters=this.getHexParameters();
        this.setState({
            canvasSize :{canvasWidth: 800, canvasHeight: 600},
            hexParameters: hexParameters
        })
    }
    componentDidMount(){
        const {canvasWidth, canvasHeight}=this.state.canvasSize;
        this.canvasHex.width=canvasWidth;
        this.canvasHex.height=canvasHeight;
        this.drawHexes();
    }

    getHexCornerCoord(center, i){
        let angle_deg = 60 * i + 30;
        let angle_rad = Math.PI / 180 * angle_deg;
        let x=center.x + this.state.hexSize * Math.cos(angle_rad);
        let y= center.y + this.state.hexSize * Math.sin(angle_rad);
        return this.Point(x,y);
    } 

    Point(x,y){
        return {x:x,y:y};
    }
    drawHex(canvasID,center){
        for(let i=0;i<6;i++){
            let start=this.getHexCornerCoord(center,i);
            let end=this.getHexCornerCoord(center,i+1);
            this.drawLine(canvasID,{x:start.x,y:start.y},{x:end.x,y:end.y});
        }
    }
    drawLine(canvasID,start,end){
        const ctx=canvasID.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(start.x,start.y);
        ctx.lineTo(end.x,end.y);
        ctx.stroke();
        ctx.closePath();
    }
    drawHexes(){
        const {canvasWidth, canvasHeight}=this.state.canvasSize;
        const {hexWidth,hexHeight,vertDist,horizDist}=this.state.hexParameters;
        const hexOrigin=this.state.hexOrigin;
        let qLeftS=Math.round(hexOrigin.x/hexWidth)*4;
        let qRightS=Math.round(canvasWidth-hexOrigin.x)/hexWidth*2;
        let rTopS=Math.round(hexOrigin.y/(hexHeight/2));
        let rBottomS=Math.round((canvasHeight-hexOrigin.y)/(hexHeight/2));

        var p=0;
        for(let r=0;r<=rBottomS;r++){
            if(r%2==0&&r!==0){
                p++;
            }
            for(let q=-qLeftS;q<=qRightS;q++){
                const {x,y}=this.hexToPixel(this.Hex(q-p,r));
                if((x>hexWidth/2&&x<canvasWidth-hexWidth/2)&&(y>hexHeight/2&&y<canvasHeight-hexHeight/2)){
                    this.drawHex(this.canvasHex,this.Point(x,y));
                    this.drawHexCoordinates(this.canvasHex,this.Point(x,y),this.Hex(q-p,r));
                }
            }
        }

        var n=0;
        for(let r=-1;r>=-rTopS;r--){
            if(r%2!==0){
                n++;
            }
            for(let q=-qLeftS;q<=qRightS;q++){
                const {x,y}=this.hexToPixel(this.Hex(q+n,r));
                if((x>hexWidth/2&&x<canvasWidth-hexWidth/2)&&(y>hexHeight/2&&y<canvasHeight-hexHeight/2)){
                    this.drawHex(this.canvasHex,this.Point(x,y));
                    this.drawHexCoordinates(this.canvasHex,this.Point(x,y),this.Hex(q-p,r));
                }
            }
        }


        /*for(let i=-rTopS;i<=rBottomS;i++){
            for(let j=-qLeftS;j<=qRightS;j++){
                let center=this.hexToPixel(this.Hex(j,i));
                if((center.x>hexWidth/2&&center.x<canvasWidth-hexWidth/2)&&(center.y<canvasHeight-hexHeight/2)){
                    this.drawHex(this.canvasHex,center);
                    this.drawHexCoordinates(this.canvasHex,center,this.Hex(j,i));
                }
            }
        }*/
    }
    hexToPixel(h){
        let hexOrigin=this.state.hexOrigin;
        let x = this.state.hexSize *Math.sqrt(3) *(h.q  + h.r/2)+ hexOrigin.x;
        let y = this.state.hexSize* (3./2 * h.r)+hexOrigin.y;
        return this.Point(x, y);
    }
    Hex(q,r){
        return {q:q,r:r};
    }
    drawHexCoordinates(canvasID,center,h){
        const ctx=canvasID.getContext("2d");
        ctx.fillText(h.q,center.x-10,center.y);
        ctx.fillText(h.r,center.x+7,center.y);
    }
    getHexParameters(){
        let hexHeight=this.state.hexSize*2; 
        let hexWidth=Math.sqrt(3)/2*hexHeight;
        let vertDist=hexHeight*3/4;
        let horizDist=hexWidth;
        return {hexWidth,hexHeight,vertDist,horizDist};
    }
    render(){
        return(
            <div className="BFS">
                <canvas ref={canvasHex=>this.canvasHex=canvasHex}></canvas>
            </div>
        )
    }
}