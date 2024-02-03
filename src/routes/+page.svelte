<script lang="ts">
  import { onMount } from "svelte";
  import { LightSwitch, setInitialClassState } from "@skeletonlabs/skeleton";
  import { formatSeconds, formatTotalSeconds } from "$lib/util/formatSeconds";
  import type { Result, WebResponse } from "../../typing/api-typing";

  let urlInput: HTMLInputElement;
  let playlistData: null | Result = null;
  let from = 1; // inclusive
  let to = 1000; // inclusive
  let unselectedItemsIndex: number[] = [];
  let notSupport = false;

  $: itemsInRange = playlistData ? playlistData.items.filter((item) => item.index >= from && item.index <= to) : [];
  $: selectedItemInRange = itemsInRange.filter((item) => !unselectedItemsIndex.includes(item.index));
  $: isAllCheckedIndeterminate = selectedItemInRange.length > 0 && selectedItemInRange.length !== itemsInRange.length;
  $: isAllChecked = selectedItemInRange.length === itemsInRange.length;
  $: totalLength = formatTotalSeconds(selectedItemInRange.reduce((acc, item) => acc + item.durationSec, 0));

  const handleRowClicked = (index: number) => {
    if (unselectedItemsIndex.includes(index)) {
      unselectedItemsIndex = unselectedItemsIndex.filter((i) => i !== index);
    } else {
      unselectedItemsIndex = [...unselectedItemsIndex, index];
    }
  };

  const handleCheckAll = (e: Event) => {
    const itemsIndexInRange = itemsInRange.map((item) => item.index);
    if (isAllChecked) {
      unselectedItemsIndex = [...unselectedItemsIndex, ...itemsIndexInRange];
    } else {
      unselectedItemsIndex = unselectedItemsIndex.filter((index) => !itemsIndexInRange.includes(index));
    }

    if (e.target) {
      const checkbox = e.target as HTMLInputElement;
      checkbox.checked = isAllChecked;
      checkbox.indeterminate = isAllCheckedIndeterminate;
    }
  };

  const handleCheckboxChange = (e: Event, index: number) => {
    if (e.target) {
      const checkbox = e.target as HTMLInputElement;
      checkbox.checked = !unselectedItemsIndex.includes(index);
    }
  };

  onMount(() => {
    async function getData() {
      let queryOptions = { active: true, lastFocusedWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      try {
        const response: WebResponse = await chrome.tabs.sendMessage(tab.id!, { msg: "playlist-data" });
        if (!response.support) {
          notSupport = true;
          return;
        }
        const data = response.data;
        playlistData = data;
        if (playlistData) {
          const allIndex = playlistData.items.map((item) => item.index);
          from = Math.min(...allIndex);
          to = Math.max(...allIndex);
        }
      } catch (e) {
        notSupport = true;
      }
    }

    setInitialClassState();
    getData();
  });
</script>

<svelte:head>
  <title>Playlist Length</title>
  <link rel="icon" type="image/png" href="/images/icon-32.png" />
  <meta name="description" content="Calculate the total length of a playlist." />
  <meta name="keywords" content="youtube,bilibili,playlist,length,duration,calculate" />
</svelte:head>

<header class="relative bg-surface-100 p-4 dark:bg-surface-800">
  <h1 class="bg-gradient-to-br from-primary-800 to-success-600 box-decoration-clone bg-clip-text text-center text-xl font-bold text-transparent dark:from-primary-800 dark:to-success-300">
    Playlist Length
  </h1>
  <div class="absolute right-4 top-4">
    <LightSwitch />
  </div>
</header>

<main class="p-4 sm:p-6" class:hidden={notSupport}>
  <div class="input-group input-group-divider grid-cols-[72px_1fr_72px_1fr] md:grid-cols-[80px_80px_80px_80px_auto]">
    <div class="input-group-shim !pr-1">Form:</div>
    <input class="overview-style" type="number" pattern="\d*" bind:value={from} min="1" placeholder="from" />
    <div class="input-group-shim">To:</div>
    <input class="overview-style" type="number" pattern="\d*" bind:value={to} min="1" placeholder="to" />
  </div>

  <div class="my-4">
    <div class="input-group input-group-divider min-h-[40px] grid-cols-[72px_1fr] md:hidden">
      <div class="input-group-shim">Total:</div>
      <div class="py-1">
        {totalLength}
      </div>
    </div>
  </div>

  <div class="table-container">
    <table class="table table-compact" class:table-interactive={playlistData} class:table-hover={playlistData}>
      <thead>
        <tr>
          {#if playlistData}
            <th colspan="3" class="!pb-0 text-primary-500">
              <div class="text-lg">
                {playlistData.title}
              </div>
              <div class="text-sm font-normal">
                {playlistData.author}
              </div>
            </th>
          {/if}
        </tr>
        <tr class="text-primary-500">
          <th class="w-14 text-center">
            {#if playlistData}
              <input class="checkbox" type="checkbox" indeterminate={isAllCheckedIndeterminate} checked={isAllChecked} on:change={(e) => handleCheckAll(e)} />
            {/if}
          </th>
          <th class="w-14">#</th>
          <th>Title, Length</th>
        </tr>
      </thead>
      {#if playlistData && playlistData.items.length > 0}
        <tbody>
          {#each itemsInRange as item}
            <tr on:click={() => handleRowClicked(item.index)}>
              <th>
                <input class="checkbox" type="checkbox" checked={!unselectedItemsIndex.includes(item.index)} on:change={(e) => handleCheckboxChange(e, item.index)} />
              </th>
              <td class="!align-middle">
                {item.index}
              </td>
              <td>
                <div class="mb-1">
                  {item.title}
                </div>
                <div class="text-xs">
                  {formatSeconds(item.durationSec)}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      {:else}
        <tbody>
          <tr>
            <td colspan="4" class="h-52" on:click={() => urlInput.focus()}>
              <div class="flex h-full cursor-pointer items-center justify-center text-xl text-primary-500">No playlist detected</div>
            </td>
          </tr>
        </tbody>
      {/if}
    </table>
  </div>
</main>

{#if notSupport}
  <div class="h2 fixed bottom-0 left-0 right-0 top-[60px] flex items-center justify-center text-primary-500">Support Youtube, Bilibili</div>
{/if}

<style>
  .input-group-divider input.overview-style {
    min-width: 72px !important;
  }
</style>
