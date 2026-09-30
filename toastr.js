/**
 * prod's success/error toasts: useToastr.js over vue-toastr, styled by
 * sass/components/_toast.scss. Top-right is vue-toastr's default position,
 * 5 s is useToastr's default timeout, and the progress bar is vue-toastr's.
 *
 *   window.protoToastr('Tarjouspyyntö tallennettu', 'success')
 */
(function () {
  var ICON = { info: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGwSURBVEhLtZa9SgNBEMc9sUxxRcoUKSzSWIhXpFMhhYWFhaBg4yPYiWCXZxBLERsLRS3EQkEfwCKdjWJAwSKCgoKCcudv4O5YLrt7EzgXhiU3/4+b2ckmwVjJSpKkQ6wAi4gwhT+z3wRBcEz0yjSseUTrcRyfsHsXmD0AmbHOC9Ii8VImnuXBPglHpQ5wwSVM7sNnTG7Za4JwDdCjxyAiH3nyA2mtaTJufiDZ5dCaqlItILh1NHatfN5skvjx9Z38m69CgzuXmZgVrPIGE763Jx9qKsRozWYw6xOHdER+nn2KkO+Bb+UV5CBN6WC6QtBgbRVozrahAbmm6HtUsgtPC19tFdxXZYBOfkbmFJ1VaHA1VAHjd0pp70oTZzvR+EVrx2Ygfdsq6eu55BHYR8hlcki+n+kERUFG8BrA0BwjeAv2M8WLQBtcy+SD6fNsmnB3AlBLrgTtVW1c2QN4bVWLATaIS60J2Du5y1TiJgjSBvFVZgTmwCU+dAZFoPxGEEs8nyHC9Bwe2GvEJv2WXZb0vjdyFT4Cxk3e/kIqlOGoVLwwPevpYHT+00T+hWwXDf4AJAOUqWcDhbwAAAAASUVORK5CYII=', success: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==' };
  var COLOR = { success: '#51A351', error: '#BD362F', info: '#2F96B4', warning: '#F89406' };
  var CSS = [
    '#proto-toast-container{position:fixed;z-index:999999;pointer-events:none;top:12px;right:12px;}',
    '#proto-toast-container>div{position:relative;pointer-events:auto;overflow:hidden;margin:0 0 6px;padding:15px 15px 15px 50px;width:300px;border-radius:3px;background-position:15px center;background-repeat:no-repeat;box-shadow:0 0 12px #999;color:#fff;opacity:.8;word-wrap:break-word;cursor:pointer;}',
    '#proto-toast-container>div:hover{box-shadow:0 0 12px #000;opacity:1;}',
    '#proto-toast-container .proto-toast-progress{position:absolute;left:0;bottom:0;height:4px;background:#000;opacity:.4;}',
    '@media (min-width:241px) and (max-width:480px){#proto-toast-container>div{padding:8px 8px 8px 50px;width:18em;}}',
    '@media (min-width:481px) and (max-width:768px){#proto-toast-container>div{padding:15px 15px 15px 50px;width:25em;}}'
  ].join('');

  function container() {
    var c = document.getElementById('proto-toast-container');
    if (c) return c;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    c = document.createElement('div');
    c.id = 'proto-toast-container';
    document.body.appendChild(c);
    return c;
  }

  window.protoToastr = function (msg, type, timeout) {
    type = type || 'success';
    timeout = timeout || 5000;
    var el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.style.backgroundColor = COLOR[type] || COLOR.success;
    if (ICON[type]) el.style.backgroundImage = 'url("' + ICON[type] + '")';
    el.textContent = msg;
    var bar = document.createElement('div');
    bar.className = 'proto-toast-progress';
    bar.style.width = '100%';
    el.appendChild(bar);
    container().appendChild(el);
    var start = Date.now();
    var timer = setInterval(function () {
      var left = Math.max(0, 1 - (Date.now() - start) / timeout);
      bar.style.width = (left * 100) + '%';
      if (left === 0) { clearInterval(timer); el.remove(); }
    }, 50);
    el.addEventListener('click', function () { clearInterval(timer); el.remove(); });
  };
})();
