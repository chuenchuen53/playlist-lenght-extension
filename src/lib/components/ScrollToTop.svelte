<script>
  let hidden = true;

  function goTop() {
    document.body.scrollIntoView({ behavior: "smooth" });
  }

  function handleOnScroll() {
    const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    hidden = !(scrollTop > window.innerHeight);
  }
</script>

<svelte:window on:scroll={handleOnScroll} />

<button type="button" on:click={goTop} class="scroll-to-top-btn back-to-top variant-glass-primary btn-icon fixed bottom-6 right-6 z-50" class:hidden aria-label="Scroll to top">
  <svg aria-hidden="true" focusable="false" class="h-5 w-5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path
      fill="currentColor"
      d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z"
    ></path>
  </svg>
</button>

<style>
  .scroll-to-top-btn {
    animation: scroll-to-top-btn-appear 0.6s ease-in-out forwards;
  }

  @keyframes scroll-to-top-btn-appear {
    0% {
      opacity: 0;
      transform: translateY(24px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
