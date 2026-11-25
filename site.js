// Copy-to-clipboard buttons for the email addresses on the Contact page.
(function () {
  var status = document.querySelector(".copy-status");
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      function done() {
        btn.textContent = "Copied";
        if (status) status.textContent = text + " copied to clipboard";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      }
      function fail() {
        // Fall back to selecting the address so it can be copied by hand.
        var addr = btn.parentNode.querySelector(".addr");
        if (addr && window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(addr);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
        btn.textContent = "Selected";
        setTimeout(function () { btn.textContent = "Copy"; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fail);
      } else {
        fail();
      }
    });
  });
})();
