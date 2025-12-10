<script lang="ts">
    import emogirl from "$lib/assets/emogurl.jpg";
</script>

<div class={`h-fit w-full flex flex-col gap-2`}>
    <hgroup>
        <h1 class={`text-5xl`}>Treb</h1>
    </hgroup>

    <div class={`flex gap-2 p-2 border-2 border-neutral-800 rounded-md`}>
        <img
            class={`h-32 aspect-square border-2 border-neutral-800 rounded-full`}
            src={emogirl}
            alt={"Human PFP"}
        />

        <div class={`flex items-center`}>
            <ul>
                <li>Name: EmoGurl</li>
                <li>Age: 89</li>
                <li>Gender: Female</li>
            </ul>
        </div>
    </div>
</div>
