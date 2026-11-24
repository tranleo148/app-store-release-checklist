// Theme switch: follows the system setting until the reader picks one; picking the system's own
// theme forgets the choice, so the page follows the system again.
(function () {
  var root = document.documentElement;
  var system = window.matchMedia("(prefers-color-scheme: dark)");
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  function current() {
    return root.getAttribute("data-theme") || (system.matches ? "dark" : "light");
  }

  function sync() {
    button.setAttribute("aria-pressed", current() === "dark" ? "true" : "false");
  }

  button.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    var followsSystem = next === (system.matches ? "dark" : "light");
    try {
      if (followsSystem) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch (e) {}
    if (followsSystem) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
    sync();
  });

  if (system.addEventListener) system.addEventListener("change", sync);
  sync();
})();

// Download: the raw file lives on another origin, where the browser ignores the download
// attribute and would only show the text. Fetch it and save it under the page's file name;
// if that fails, the link opens the raw file instead.
(function () {
  var link = document.getElementById("download-md");
  if (!link || !window.fetch) return;

  link.addEventListener("click", function (event) {
    event.preventDefault();
    fetch(link.href)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.text();
      })
      .then(function (text) {
        var url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
        var save = document.createElement("a");
        save.href = url;
        save.download = link.getAttribute("download");
        document.body.appendChild(save);
        save.click();
        save.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      })
      .catch(function () {
        window.location.href = link.href;
      });
  });
})();
