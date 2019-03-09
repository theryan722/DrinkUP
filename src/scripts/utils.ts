function removeSkeletonTextEffect(element: string) {
    $$(element).removeClass('skeleton-text skeleton-effect-fade');
}

function applySkeletonTextEffect(element: string) {
    $$(element).addClass('skeleton-text skeleton-effect-fade');
}