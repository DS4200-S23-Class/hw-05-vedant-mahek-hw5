const FRAME_HEIGHT = 400;
const FRAME_WIDTH = 600; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};


const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left -MARGINS.right;

const FRAME2 = d3.select("#vis")
                    .append("svg")
                        .attr("height", FRAME_HEIGHT)
                        .attr("width", FRAME_WIDTH)
                        .attr("class", "frame");

function scatter_plot() { 
d3.csv("data/scatter-data.csv").then((data) => {
    console.log(data);
    
    const MAX_X2 = d3.max(data, (d) => {return parseInt(d.x)});

    const MAX_Y2 = d3.max(data, (d) => {return parseInt(d.y)});

    
    const X_SCALE2 = d3.scaleLinear()
                        .domain([0, MAX_X2])
                        .range([0, VIS_WIDTH]);

    const Y_SCALE2 = d3.scaleLinear()
                        .domain([0, MAX_Y2])
                        .range([VIS_HEIGHT, 0]);

    // plot
    FRAME2.selectAll("circle")
    .data(data) 
    .enter()
    .append("circle")
        .attr("cx", (d) => {return X_SCALE2(d.x) + MARGINS.left})
        .attr("cy", (d) => {return Y_SCALE2(d.y) + MARGINS.top})
        .attr("r", 10)
        .attr("class", "point");
    
    // make x axis
    FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(X_SCALE2).ticks(10))
            .attr("font-size", "20px");

    // make y axis
    FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
            .call(d3.axisLeft(Y_SCALE2).ticks(9))
            .attr("font-size", "20px");

    function addPoint() {
        const X_SCALE2 = d3.scaleLinear()
                        .domain([0, 9])
                        .range([0, VIS_WIDTH]);
    
        const Y_SCALE2 = d3.scaleLinear()
                            .domain([0, 9])
                            .range([VIS_HEIGHT, 0]);
    
        let xCoord = document.getElementById("x").value;
        let yCoord = document.getElementById("y").value;
    
        // add point to plot
        FRAME2.append("circle")
            .attr("cx", () => {return X_SCALE2(xCoord) + MARGINS.left})
            .attr("cy", () => {return Y_SCALE2(yCoord) + MARGINS.top})
            .attr("r", 10)
            .attr("class", "point");
        
        FRAME2.selectAll(".point").on("click", handleClick);
    }
    
    // add event listener to add point to plot
    let pointButton = document.getElementById("point-button");
    pointButton.addEventListener("click", addPoint);

    //click point
    function handleClick(event, d) {
        this.classList.toggle("border")
        let x_coord = d3.select(this).attr("cx");
        let y_coord = d3.select(this).attr("cy");

        x_coord = Math.round(X_SCALE2.invert(x_coord - MARGINS.left));
        y_coord = Math.round(Y_SCALE2.invert(y_coord - MARGINS.top));
        document.getElementById('output').innerHTML = `Last point clicked (${x_coord}, ${y_coord})`
    }

    FRAME2.selectAll(".point").on("click", handleClick);

});
}
scatter_plot()
    

 
    
// bar graph
const FRAME1 = d3.select("#bar")
                  .append("svg")
                  .attr("height", FRAME_HEIGHT)
                  .attr("width", FRAME_WIDTH)
                  .attr("class", "frame");


function plot(){
    d3.csv("data/bar-data.csv").then((data) => { 

        const Y_MAX = d3.max(data, (d) => { return parseInt(d.amount); });
        
        const X_SCALE = d3.scaleBand()
            .range([0, VIS_WIDTH])
            .domain(data.map(function(d) {return d.category;}));
            
        const Y_SCALE = d3.scaleLinear() 
            .domain([0, Y_MAX])
            .range([VIS_HEIGHT, MARGINS.top]);

        FRAME1.selectAll('bars')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", (d) => { return X_SCALE(d.category) + MARGINS.left; })
            .attr("y", (d) => { return Y_SCALE(d.amount) + MARGINS.bottom; })
              .attr('width', X_SCALE.bandwidth())
              .attr('height', (d) => VIS_HEIGHT - Y_SCALE(d.amount))
              .attr('fill', 'powderblue')
              .attr('class', 'bar');


    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")")
        .call(d3.axisBottom(X_SCALE).ticks(10))
        .attr("font-size", "20px");


    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_SCALE).ticks(9))
        .attr("font-size", "20px");
    
    const TOOLTIP = d3.select("#bar")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0); 

    function barMousemove(event, d) {
        TOOLTIP.html("Category:" + d.category + "<br>Value: " + d.amount)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 50) + "px")
        }
    
    function barMouseover(event, d) {
            TOOLTIP.style("opacity", 1)
        }
    
    function barMouseleave(event, d) {
            TOOLTIP.style("opacity", 0)
        }


    FRAME1.selectAll(".bar")
        .on("mouseover", barMouseover)
        .on("mousemove", barMousemove)
        .on("mouseleave", barMouseleave);
        

});  

}

plot()
    
