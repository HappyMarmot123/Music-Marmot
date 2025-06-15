import ModalPlayer from "@/features/listModal/ui/modalPlayer";
import ModalTrackList from "@/features/listModal/ui/modalTrackList";
import ModalWrapper from "@/features/listModal/ui/modalWrapper";

/*
  TODO:
  tippy.js 툴팁 괜찮은데, react19 에러가 뜨네...
  https://www.npmjs.com/package/tippy.js
*/

export default function ListModal() {
  return (
    <ModalWrapper>
      <ModalPlayer />
      <ModalTrackList />
    </ModalWrapper>
  );
}
