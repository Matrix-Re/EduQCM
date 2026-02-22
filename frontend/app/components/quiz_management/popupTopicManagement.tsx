import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { TableTopic } from "~/components/quiz_management/tableTopic";
import TopicForm from "~/components/quiz_management/topic-form";
import { useTranslation } from "react-i18next";

export function PopupTopicManagement() {
  const emptyFunction = () => {};
  const { t } = useTranslation();
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--secondary)]">
            {t("quiz_management.manage_topics")}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[525px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{t("quiz_management.manage_topics")}</DialogTitle>
          </DialogHeader>

          <TopicForm onSubmit={emptyFunction} />
          <TableTopic onSelectionChange={emptyFunction} />
        </DialogContent>
      </form>
    </Dialog>
  );
}
