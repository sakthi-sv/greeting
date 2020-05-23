import React, { Component, createRef } from "react";
import image from "../Image/sample.jpg";
import { SliderPicker } from "react-color";
import "./Canvas.css"
export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.imgRef = createRef();
    this.state = {
      ChImg: false,
      ChText:false,
      Edit:false,
      SelectedFile: "",
      ctx: "",
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      ShowColorPicker: false,
      color: "#fff",
      text: "",
      img:""
    };
  }
  async componentDidMount() {
    this.setState((prevState, props) => {
      return { ctx: this.canvasRef.current.getContext("2d") };
    });
  }
  drawImage = () => {
    console.log(this.state.ctx);
    this.canvasRef.current.width = window.innerWidth - 20;
    this.canvasRef.current.height = window.innerHeight - 50;
    this.state.ctx.drawImage(
      this.imgRef.current,
      10,
      10,
      window.innerWidth - 10,
      window.innerHeight - 50
    );
  };
  fileChangeHandler = (event) => {
    console.log(event.target.files);

    this.setState(()=>{
      return {SelectedFile: URL.createObjectURL(event.target.files[0])}
    });
    this.drawImage();
  };
  drawLine = () => {
    let { ctx, x, y, x1, y1, color } = this.state;
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = `${color}`;
    ctx.stroke();
  };
  drawCircle = () => {
    let { ctx, x, y, color } = this.state;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.strokeStyle = `${color}`;
    ctx.stroke();
  };
  drawText = () => {
    let { ctx, x, y, color, text } = this.state;
    ctx.font = "30px Arial";
    ctx.strokeStyle = `${color}`;
    ctx.strokeText(`${text}`, x, y);
  };
  importCanvas=()=>{
    this.setState({
      img:localStorage.getItem("canvas")
    })

  }
  exportCanvas=()=>{
    const canvasimg=  this.canvasRef.current.toDataURL()
    localStorage.setItem("canvas",canvasimg)
  }
  render() {
    const {
      ChImg,
      ChText,
      
      SelectedFile,
      x,
      y,
      x1,
      y1,
      color,
      ShowColorPicker,
      text,
      img
    } = this.state;
    return (
      <div>
        <canvas
          ref={this.canvasRef}
          onMouseUp={(e) => {
            this.setState({ x1: e.screenX, y1: e.screenY });
            console.log("ert", x1, y1);
          }}
          onMouseDown={(e) => {
            this.setState({ x: e.screenX, y: e.screenY });
            console.log("h", x, y);
          }}
        />
        
        {ChImg && <input type="file" onChange={this.fileChangeHandler}></input>}
        <button
          onClick={() => {
            this.setState((prevState, props) => {
              return { ChImg: !prevState.ChImg };
            });
          }}
        >
          {ChImg ? "close" : "change Image"}
        </button>
        <button onClick={this.drawLine}>draw Line</button>
        <button onClick={this.drawCircle}>draw Circle</button>
        <button
          onClick={() => {
            this.setState((prevState, props)=>{
              return{ShowColorPicker: !ShowColorPicker}
            });
            
          }}
        >
          {ShowColorPicker ? "Close" : "Change color"}
        </button>
        {ShowColorPicker && (
          <SliderPicker
            color={color}
            onChange={(updateColor) => {
              this.setState({
                color: updateColor.hex,
              });
            }}
          />
        )}
        {
            ChText &&
            <textarea
          placeholder="Enter Text"
          value={text}
          onChange={(event) => {
            this.setState({
              text: event.target.value,
            }); 
          }}
        ></textarea>}
        <button
        onClick={()=>{
            this.setState((prevState, props) => {
                return { ChText: !prevState.ChText };
            });
            //this.drawText
        }}
        >
            {ChText?"Apply":"Create Text"}</button>
        <button onClick={this.importCanvas}>Import</button>
        <button onClick={this.exportCanvas}>Export</button>
        <img
          style={{ display: "none" }}
          ref={this.imgRef}
          src={img||SelectedFile || image}
          alt=""
          onLoad={this.drawImage}
        />
      </div>
    );
  }
}
