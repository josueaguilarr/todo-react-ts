import { useState } from "react";
import { Group, GroupName, Note } from "../types/types";

interface Props {
  groups: Group[];
  groupSelected: number | null;
  setGroupSelected: ({ id_group }: Pick<Note, "id_group">) => void;
  setAddGroup: ({ group }: { group: GroupName }) => void;
}

export const Groups: React.FC<Props> = ({
  groups,
  groupSelected,
  setGroupSelected,
  setAddGroup,
}) => {
  const [newGroup, setNewGroup] = useState<string>("");

  const handleChangeNewGroup: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => setNewGroup(target.value);

  const handleAddNewGroup = () => {
    if (newGroup === "") return;

    setAddGroup({ group: newGroup });
    setNewGroup("");
  };

  return (
    <div className="flex h-[40px] w-full mt-2 mb-16 gap-2 overflow-auto will-change-scroll [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-500/40">
      <div
        className={`rounded-lg max-w-[200px] bg-neutral-800/40 px-2 py-1.5 cursor-pointer hover:bg-neutral-800/80 duration-500 border-neutral-600/70 border border-dashed`}
      >
        <input
          value={newGroup}
          type="text"
          placeholder="Nuevo grupo"
          className="bg-transparent font-medium text-sm max-w-[85px] focus:outline-none"
          onBlur={handleAddNewGroup}
          onChange={handleChangeNewGroup}
        />
      </div>

      {groups.map(({ id, group_name, has_pending }) => (
        <div
          onClick={() =>
            groupSelected === id
              ? setGroupSelected({ id_group: null })
              : setGroupSelected({ id_group: id })
          }
          key={id}
          className={`rounded-lg max-w-[200px] bg-neutral-800/40 p-2 cursor-pointer hover:bg-neutral-800/80 duration-500 border ${
            groupSelected === id ? "border-yellow-600" : "border-neutral-800/60"
          }`}
        >
          <div className="flex items-center justify-between gap-1">
            <p className="font-medium text-sm truncate">{group_name}</p>
            <span
              className={`flex gap-1 justify-center items-center truncate text-[11px] font-medium px-1 rounded-full ${
                has_pending ? "text-yellow-600" : "text-green-600"
              }`}
            >
              <span className="relative flex size-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    has_pending ? "bg-yellow-600" : "bg-green-600"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full size-2 ${
                    has_pending ? "bg-yellow-600" : "bg-green-600"
                  }`}
                ></span>
              </span>
              {has_pending ? "Pendientes" : "Sin pendientes"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
