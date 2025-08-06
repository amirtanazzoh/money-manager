import { Price } from "@/components/price";

interface ReportCardProps {
    title: string;
    value: number;
    icon?: React.ReactNode;
    className?: string;
}

export default function ReportCard ( { title, value, icon, className }: ReportCardProps ) {
    return (
        <div
            className={ `bg-white rounded-lg shadow p-6 flex items-center gap-4 ${ className || "" }` }
        >
            { icon && <div className="text-blue-500 text-3xl size-6">{ icon }</div> }
            <div>
                <h3 className="text-gray-600 font-medium">{ title }</h3>
                <p className="text-2xl font-bold">{ <Price amount={ value } /> }</p>
            </div>
        </div>
    );
}
