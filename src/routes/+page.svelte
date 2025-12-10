<script>
    import ChatWindow from "$lib/components/ChatWindow.svelte";
    import DialogueOptions from "$lib/components/DialogueOptions.svelte";
    import FileWindow from "$lib/components/FileWindow.svelte";
    import Title from "$lib/components/Title.svelte";
</script>

<main class={`h-dvh w-dvw flex flex-row p-4 gap-2`}>
    <section class={`h-full w-1/3 flex flex-col gap-2`}>
        <Title />

        <DialogueOptions />
    </section>

    <section class={`h-full w-1/3`}>
        <ChatWindow />
    </section>

    <section class={`h-full w-1/3`}>
        <FileWindow />
    </section>
</main>
