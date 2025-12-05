import clsx from 'clsx';

export default function Card({ title, children, className = '', action }) {
    return (
        <div className={clsx('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
            {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
        </div>
    );
}
