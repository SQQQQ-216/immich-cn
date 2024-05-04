<script lang="ts">
  import ConfirmDialogue from '$lib/components/shared-components/confirm-dialogue.svelte';
  import { handleError } from '$lib/utils/handle-error';
  import { deleteUser, type UserResponseDto } from '@immich/sdk';
  import { serverConfig } from '$lib/stores/server-config.store';
  import { createEventDispatcher } from 'svelte';
  import Checkbox from '$lib/components/elements/checkbox.svelte';

  export let user: UserResponseDto;

  let forceDelete = false;
  let deleteButtonDisabled = false;
  let userIdInput: string = '';

  const dispatch = createEventDispatcher<{
    success: void;
    fail: void;
    cancel: void;
  }>();

  const handleDeleteUser = async () => {
    try {
      const { deletedAt } = await deleteUser({
        id: user.id,
        deleteUserDto: { force: forceDelete },
      });

      if (deletedAt == undefined) {
        dispatch('fail');
      } else {
        dispatch('success');
      }
    } catch (error) {
      handleError(error, 'Unable to delete user');
      dispatch('fail');
    }
  };

  const handleConfirm = (e: Event) => {
    userIdInput = (e.target as HTMLInputElement).value;
    deleteButtonDisabled = userIdInput != user.email;
  };
</script>

<ConfirmDialogue
  id="delete-user-confirmation-modal"
  title="删除用户"
  confirmText={forceDelete ? '永久删除' : '删除'}
  onConfirm={handleDeleteUser}
  onClose={() => dispatch('cancel')}
  disabled={deleteButtonDisabled}
>
  <svelte:fragment slot="prompt">
    <div class="flex flex-col gap-4">
      {#if forceDelete}
        <p>
          <b>{user.name}</b>的账户和资源将被立即删除，<b>无法恢复.
        </p>
      {:else}
        <p>
          <b>{user.name}</b>的账户和资源将在 {$serverConfig.userDeleteDelay} 天内被安排删除.
          days.
        </p>
      {/if}

      <div class="flex justify-center m-4 gap-2">
        <Checkbox
          id="queue-user-deletion-checkbox"
          label="Queue user and assets for immediate deletion"
          labelClass="text-sm dark:text-immich-dark-fg"
          bind:checked={forceDelete}
          on:change={() => {
            deleteButtonDisabled = forceDelete;
          }}
        />
      </div>

      {#if forceDelete}
        <p class="text-immich-error">
          警告：此操作将立即删除用户及其所有资产。此操作无法撤销，并且文件无法恢复.
        </p>

        <p class="immich-form-label text-sm" id="confirm-user-desc">
          确认后，请在下方输入"{user.email}"
        </p>

        <input
          class="immich-form-input w-full pb-2"
          id="confirm-user-id"
          aria-describedby="confirm-user-desc"
          name="confirm-user-id"
          type="text"
          on:input={handleConfirm}
        />
      {/if}
    </div>
  </svelte:fragment>
</ConfirmDialogue>
