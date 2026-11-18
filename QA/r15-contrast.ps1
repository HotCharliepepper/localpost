Add-Type -AssemblyName System.Drawing
$workspace = Split-Path $PSScriptRoot -Parent
$samples = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'r15-contrast-samples.json') -Raw -Encoding UTF8 | ConvertFrom-Json
function Get-Luminance($r, $g, $b) {
    $channels = @($r, $g, $b) | ForEach-Object { $v = $_ / 255.0; if ($v -le 0.04045) { $v / 12.92 } else { [Math]::Pow(($v + 0.055) / 1.055, 2.4) } }
    return 0.2126 * $channels[0] + 0.7152 * $channels[1] + 0.0722 * $channels[2]
}
$results = foreach ($screen in $samples) {
    $bitmap = [System.Drawing.Bitmap]::FromFile((Join-Path $workspace ('previews/r15/contrast-' + $screen.name + '.png')))
    foreach ($sample in $screen.text) {
        $channels = [regex]::Matches($sample.color, '[\d.]+') | ForEach-Object { [double]$_.Value }
        $foreground = Get-Luminance $channels[0] $channels[1] $channels[2]
        $minimum = 99.0
        foreach ($px in @(0.1, 0.3, 0.5, 0.7, 0.9)) {
            foreach ($py in @(0.2, 0.5, 0.8)) {
                $x = [Math]::Min($bitmap.Width - 1, [Math]::Max(0, [int]($sample.rect[0] + $sample.rect[2] * $px)))
                $y = [Math]::Min($bitmap.Height - 1, [Math]::Max(0, [int]($sample.rect[1] + $sample.rect[3] * $py)))
                $pixel = $bitmap.GetPixel($x, $y)
                $background = Get-Luminance $pixel.R $pixel.G $pixel.B
                $ratio = ([Math]::Max($foreground, $background) + 0.05) / ([Math]::Min($foreground, $background) + 0.05)
                $minimum = [Math]::Min($minimum, $ratio)
            }
        }
        $fontSize = [double]($sample.size -replace 'px', '')
        $threshold = if ($fontSize -ge 24 -or ($fontSize -ge 18.66 -and [double]$sample.weight -ge 700)) { 3 } else { 4.5 }
        [pscustomobject]@{screen=$screen.name;text=$sample.text;ratio=[Math]::Round($minimum, 2);threshold=$threshold;pass=$minimum -ge $threshold}
    }
    $bitmap.Dispose()
}
$results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'r15-contrast-results.json') -Encoding UTF8
$results | Where-Object { -not $_.pass } | Format-Table -AutoSize
[pscustomobject]@{ranges=$results.Count;failed=@($results | Where-Object { -not $_.pass }).Count;minimum=($results.ratio | Measure-Object -Minimum).Minimum} | ConvertTo-Json
