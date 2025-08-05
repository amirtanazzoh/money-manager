interface PriceProps {
    amount: number;
    currency?: string;
    locale?: string;
}

function shortenNumber ( num: number ): string {
    const absNum = Math.abs( num );
    let result = "";

    if ( absNum >= 1_000_000_000 ) result = ( num / 1_000_000_000 ).toFixed( 1 ) + "B";
    else if ( absNum >= 1_000_000 ) result = ( num / 1_000_000 ).toFixed( 1 ) + "M";
    else if ( absNum >= 1_000 ) result = ( num / 1_000 ).toFixed( 1 ) + "K";
    else result = num.toString();

    // 🔥 Remove trailing .0 if it exists
    return result.replace( /\.0([KMB])$/, "$1" );
}

export function Price ( { amount, currency = "Toman", locale = "fa-IR" }: PriceProps ) {
    const isNegative = amount < 0;
    const absAmount = Math.abs( amount );
    const formatted = new Intl.NumberFormat( locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    } ).format( absAmount );

    // Shorten large number or show full formatted number
    const displayValue =
        absAmount >= 1000 ? shortenNumber( amount ) : formatted;

    return (
        <span className={ isNegative ? "text-red-600 font-semibold" : "" }>
            { displayValue } { currency }
        </span>
    );
}
