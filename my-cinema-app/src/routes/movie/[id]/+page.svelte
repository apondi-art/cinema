<script>
    import MovieDetail from '$lib/components/MovieDetail.svelte';
    export let data;
</script>

<svelte:head>
    <title>{data.media.title} - Movie Details</title>
    <meta name="description" content={data.media.overview} />
</svelte:head>

<MovieDetail {data} />



