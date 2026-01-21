$pagesDir = "c:\Users\bibic\Desktop\Mes dossiers\crk-site-main\pages"
$htmlFiles = Get-ChildItem -Path $pagesDir -Filter "cookie_*.html"

Write-Host "Mise a jour de" $htmlFiles.Count "fichiers HTML..."

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace '<a class="btn-costume" href="#">Costumes</a>', '<a class="btn-costume" href="#"><span>Costumes</span></a>'
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    Write-Host "Mis a jour:" $file.Name -ForegroundColor Green
}

Write-Host "Termine!" $htmlFiles.Count "fichiers traites." -ForegroundColor Cyan
