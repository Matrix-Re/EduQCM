import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {TableTopic} from "~/components/tableTopic";
import TopicForm from "~/components/topic-form";

export function PopupTopicManagement() {
    const emptyFunction = () => {};
    return (
        <Dialog>
            <form >
                <DialogTrigger asChild>
                    <Button className="bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--secondary)]">Manage topics</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Manage topics</DialogTitle>
                    </DialogHeader>

                    <TopicForm onSubmit={emptyFunction}/>
                    <TableTopic onSelectionChange={emptyFunction}/>

                </DialogContent>
            </form>
        </Dialog>
    )
}
