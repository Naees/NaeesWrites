// Header: scroll-aware nav, dark mode toggle, logo switching, mobile menu
(function() {
  const base = document.querySelector('header')?.dataset.base || ''

  // Scroll-aware nav
  const header = document.querySelector('header')
  let lastScrollY = 0
  let ticking = false

  function updateNav() {
    const currentScrollY = window.scrollY
    if (currentScrollY <= 0) {
      header.classList.remove('nav-hidden')
      header.classList.remove('nav-scrolled')
    } else if (currentScrollY > lastScrollY) {
      header.classList.add('nav-hidden')
      header.classList.remove('nav-scrolled')
    } else {
      header.classList.remove('nav-hidden')
      header.classList.add('nav-scrolled')
    }
    lastScrollY = currentScrollY
    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav)
      ticking = true
    }
  }, { passive: true })

  // Dark mode toggle
  const toggle = document.querySelector('#dark-mode-toggle')
  const sunIcon = toggle.querySelector('.sun-icon')
  const moonIcon = toggle.querySelector('.moon-icon')
  const label = toggle.querySelector('.label')

  function updateIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    if (isDark) {
      sunIcon.style.display = 'none'
      moonIcon.style.display = 'block'
      label.textContent = 'dark'
    } else {
      sunIcon.style.display = 'block'
      moonIcon.style.display = 'none'
      label.textContent = 'light'
    }
  }

  updateIcon()

  function handleClick() {
    const current = localStorage.getItem('theme')
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    updateIcon()
  }

  toggle.addEventListener('click', handleClick)
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  })

  // Logo switching
  const lightLogo = document.querySelector('.site-logo--light')
  const darkLogo = document.querySelector('.site-logo--dark')
  const mobileLogo = document.querySelector('.site-logo--mobile')

  function updateLogo() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isDark) {
      lightLogo.style.display = 'none'
      darkLogo.style.display = 'block'
    } else {
      lightLogo.style.display = 'block'
      darkLogo.style.display = 'none'
    }
    if (isMobile) {
      mobileLogo.style.display = 'block'
    } else {
      mobileLogo.style.display = 'none'
    }
  }

  updateLogo()

  const mql = window.matchMedia('(max-width: 768px)')
  mql.addListener(() => updateLogo())

  const observer = new MutationObserver(() => {
    updateLogo()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger')
  const mobileNav = document.querySelector('.mobile-nav')
  const mobileNavContent = mobileNav.querySelector('.mobile-nav-content')

  function toggleMobileMenu() {
    if (!mobileNav || !mobileNavContent) return
    const isOpen = mobileNav.getAttribute('aria-hidden') === 'false'

    if (isOpen) {
      mobileNav.style.transform = 'translateX(100%)'
      mobileNav.setAttribute('aria-hidden', 'true')
      hamburger.setAttribute('aria-expanded', 'false')
    } else {
      mobileNav.style.transform = 'translateX(0)'
      mobileNav.setAttribute('aria-hidden', 'false')
      hamburger.setAttribute('aria-expanded', 'true')
    }
  }

  hamburger.addEventListener('click', toggleMobileMenu)

  // Close mobile menu when a link is clicked
  mobileNavContent.addEventListener('click', (e) => {
    const link = e.target.closest('a')
    if (link) {
      setTimeout(() => {
        mobileNav.style.transform = 'translateX(100%)'
        mobileNav.setAttribute('aria-hidden', 'true')
        hamburger.setAttribute('aria-expanded', 'false')
      }, 100)
    }
  })

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav.getAttribute('aria-hidden') === 'false') {
      const target = e.target
      if (!hamburger.contains(target) && !mobileNav.contains(target)) {
        mobileNav.style.transform = 'translateX(100%)'
        mobileNav.setAttribute('aria-hidden', 'true')
        hamburger.setAttribute('aria-expanded', 'false')
      }
    }
  })

  // Close mobile menu on touch outside (mobile fix)
  document.addEventListener('touchstart', (e) => {
    if (mobileNav.getAttribute('aria-hidden') === 'false') {
      const target = e.target
      if (!hamburger.contains(target) && !mobileNav.contains(target)) {
        mobileNav.style.transform = 'translateX(100%)'
        mobileNav.setAttribute('aria-hidden', 'true')
        hamburger.setAttribute('aria-expanded', 'false')
      }
    }
  })
})()
