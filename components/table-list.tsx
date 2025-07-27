'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Item } from "@/app/item"

interface TableListProps {
    lista: Item[]
    onRemoveItem: (id: number) => void
}

export function TableList({ lista, onRemoveItem }: TableListProps) {
    return (
        <>
            {lista.length === 0 && (
                <h1>Adicione um item a lista</h1>
            )}
            {lista.length > 0 && (
                <Table className="w-[50%] m-auto">
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantidade</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lista.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">
                                    <Checkbox 
                                        className="w-[30px] h-[30px]"
                                        onCheckedChange={() => onRemoveItem(item.id)}
                                    />
                                </TableCell>
                                <TableCell>{item.item}</TableCell>
                                <TableCell className="w-[25px]">{item.qtd}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    )
}