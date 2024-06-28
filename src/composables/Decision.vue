<script>
export async function decision() {
    return new Promise(function (resolve, reject) {
        let decision = document.createElement("div");
        decision.className = "decision dark:bg-indigo-950 dark:text-slate-200 dark:border-indigo-900 bg-violet-200 border-violet-300";
        decision.innerHTML = `<span>Na pewno?</span><br /><button id="button_tak">TAK</button><button id="button_nie">NIE</button>`;
        document.querySelector('#container').appendChild(decision);
        decision.style.animation = "slideInDown 0.5s ease";
        document.querySelector("#button_tak").addEventListener("click", function () {
            resolve();
        })
        document.querySelector("#button_nie").addEventListener("click", function () {
            reject();
        })
    })
}
</script>

<style>
.decision{
    margin: auto;
    position: fixed;
    width: 400px;
    height: 150px;
    top: 30px;
    left: 0;
    right: 0;
    max-width: 90%;
    text-align: center;
    padding-top: 30px;
    border-width: 2px;
}
.decision span{
  font-size: 26px;
  font-weight: 600;
}
.decision button{
  border: 0;
    outline: none;
    height: 35px;
    width: 100px;
    color: #fff;
    margin-left: 10px;
    margin-top: 20px;
    cursor: pointer;
    transition: 0.4s;
}
#button_nie{
    background: #e74c3c;
}
.dark #button_nie{
    background: #d63b2b;
}
#button_tak{
    background: #2ecc71;
}
.dark #button_tak{
    background: #1dbb60;
}
@keyframes slideInDown{0%{-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0);visibility:visible}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}
</style>