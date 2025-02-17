import { useState } from "react";
import { Group, NoteIdPick, Note as NoteType } from "../types/types";
import { SixDotsIcon, SuccessIcon } from "../icons/Icons";
import { ActionsNote } from "./ActionsNote";
import { Modal } from "./Modal";

interface Props
  extends Pick<NoteType, "uuid" | "content" | "completed" | "id_group"> {
  groups: Group[];
  isAuthenticated: boolean;
  setCompleted: ({
    uuid,
    completed,
  }: Pick<NoteType, "uuid" | "completed">) => void;
  setTitle: ({ uuid, content }: Pick<NoteType, "uuid" | "content">) => void;
  removeNote: ({ uuid }: NoteIdPick) => void;
  moveNoteToGroup: ({
    id_group,
    uuid,
  }: Pick<NoteType, "id_group" | "uuid">) => void;
}

export const Note: React.FC<Props> = ({
  uuid,
  content,
  completed,
  id_group,
  groups,
  isAuthenticated,
  removeNote,
  setCompleted,
  setTitle,
  moveNoteToGroup,
}) => {
  const [EditedTitle, setEditedTitle] = useState(content);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(id_group);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(!isModalOpen);

  const closeModal = async () => {
    setModalOpen(!isModalOpen);

    if (selectedGroup == id_group) return;

    setTimeout(() => {
      const currentNote = document.getElementById(uuid);
      currentNote?.classList.remove("animate-fadeIn");
      currentNote?.classList.add("animate-fadeOut");

      currentNote?.addEventListener("animationend", () => {
        currentNote.remove();
        moveNoteToGroup({ id_group: selectedGroup, uuid });
      });
    });
  };

  const handleCheckboxChange = (groupId: number) =>
    setSelectedGroup((prev) => (prev === groupId ? null : groupId));

  const handleRemove = () => {
    setTimeout(() => {
      const currentNote = document.getElementById(uuid);
      currentNote?.classList.remove("animate-fadeIn");
      currentNote?.classList.add("animate-fadeOut");

      currentNote?.addEventListener("animationend", () => {
        currentNote.remove();
        removeNote({ uuid });
      });
    });
  };

  const handleSaveContent = () => {
    if (EditedTitle !== content)
      setTitle({ uuid, content: EditedTitle.trim() });

    if (EditedTitle === "") removeNote({ uuid });
  };

  const handleChangeContent: React.ChangeEventHandler<HTMLTextAreaElement> = ({
    target,
  }) => setEditedTitle(target.value);

  return (
    <>
      <div
        id={uuid}
        className="flex items-center justify-between py-3 gap-5
          animate-fadeIn"
      >
        <SixDotsIcon className="size-7" />

        <div className="flex items-center gap-4">
          <label
            className="relative flex cursor-pointer items-center rounded-md"
            htmlFor={`note-checkbox-${uuid}`}
          >
            <input
              type="checkbox"
              className={`before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#3178c6] checked:bg-[#3178c6] checked:before:bg-[#3178c6] hover:before:opacity-10`}
              checked={completed}
              onChange={(e) =>
                setCompleted({ uuid, completed: e.target.checked })
              }
              id={`note-checkbox-${uuid}`}
            />
            {completed && (
              <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                <SuccessIcon className="size-4" />
              </div>
            )}
          </label>
        </div>

        <textarea
          className={`w-full bg-transparent rounded-md p-1 font-medium text-lg focus:outline-none resize-none ${
            completed ? "opacity-[0.65] line-through" : ""
          }`}
          value={EditedTitle}
          onChange={handleChangeContent}
          onBlur={handleSaveContent}
        ></textarea>

        <ActionsNote
          uuid={uuid}
          handleRemove={handleRemove}
          openModal={openModal}
          isAuthenticated={isAuthenticated}
          isGroupSelected={selectedGroup}
          moveNoteToGroup={moveNoteToGroup}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        id={`modal-note-${uuid}`}
      >
        <h2 className="text-2xl font-bold mb-6">Tus grupos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {groups.map(({ id, group_name }, index) => (
            <div
              key={index}
              title={group_name}
              className={`col-span-1 p-3 rounded-lg flex items-center gap-2 bg-neutral-700/30 ${
                selectedGroup !== null && selectedGroup != id
                  ? "opacity-50"
                  : ""
              }`}
            >
              <label
                className="relative flex cursor-pointer items-center rounded-md"
                htmlFor={`groups-${id}`}
              >
                <input
                  type="checkbox"
                  className={`before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-9 before:w-9 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-[#3178c6] checked:bg-[#3178c6] checked:before:bg-[#3178c6] hover:before:opacity-10`}
                  checked={selectedGroup === id}
                  onChange={() => handleCheckboxChange(id)}
                  id={`groups-${id}`}
                />
                {selectedGroup === id && (
                  <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                    <SuccessIcon className="size-4" />
                  </div>
                )}
              </label>
              <span className="truncate">{group_name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
