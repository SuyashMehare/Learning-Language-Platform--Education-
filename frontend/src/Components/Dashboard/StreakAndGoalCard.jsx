function StreakAndGoalCard({ data, unit, postCss } ) {
    return <div class="h-fit min-w-3xs p-5 bg-gray-800 rounded">
        {
            Object.keys(data).map((key, idx) => {
                return <div key={key+idx} 
                class={`flex ${postCss}`}>
                    <span class="mr-4 text-lg font-medium">{key}: </span>
                    <p class="align-center">{data[key]} {unit}</p>
                </div>
            })
        }
    </div>
}

export {
    StreakAndGoalCard
}