// Footer: nav link scroll handling
(function() {
  let isScrolling = false
  let scrollIdleTimer = null

  window.addEventListener('scroll', () => {
    isScrolling = true
    if (scrollIdleTimer) clearTimeout(scrollIdleTimer)
    scrollIdleTimer = setTimeout(function() { isScrolling = false }, 150)
  }, { passive: true })

  document.querySelectorAll('.footer-nav a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault()
      var href = link.getAttribute('href') || ''

      // External link — open in new tab
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
        window.open(href, '_blank', 'noopener noreferrer')
        return
      }

      var parsed = new URL(href, window.location.href)
      var isSamePage = parsed.pathname === window.location.pathname

      if (isSamePage && parsed.hash) {
        // Same page — fast scroll to section
        var target = document.querySelector(parsed.hash)
        if (target) {
          var rect = target.getBoundingClientRect()
          var top = window.scrollY + rect.top - 80
          window.scrollTo({ top: top, behavior: 'smooth' })
          isScrolling = true
        }
      } else if (isSamePage) {
        // Same page, no hash — scroll to top
        var top2 = window.scrollY
        window.scrollTo({ top: top2, behavior: 'smooth' })
        isScrolling = true
      } else {
        // Different page — navigate then scroll
        window.location.href = href
      }
    })
  })
})()
